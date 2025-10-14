import { Bot, session } from "grammy";
import "dotenv/config";
import { autoRetry } from "@grammyjs/auto-retry";
import {
	type Conversation,
	type ConversationFlavor,
	conversations,
} from "@grammyjs/conversations";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import type {
	ConnectorDTO,
	DomainDTO,
	MethodDTO,
	PaymentDTO,
	ProjectDTO,
	ProviderDTO,
} from "@hfam/shared/dto/index";
import type { Context, SessionFlavor } from "grammy";
import { connectors } from "./features/connectors";
import { domains } from "./features/domains";
import { methods } from "./features/methods";
import { payments } from "./features/payments";
import { projects } from "./features/projects";
import { providers } from "./features/providers";
import { start } from "./features/start";
import viewPayment from "./views/Payment";

interface SessionData {
	projectId: ProjectDTO["id"] | null;
	providerKey: ProviderDTO["key"] | null;
	domainId: DomainDTO["id"] | null;
	connectorId: ConnectorDTO["id"] | null;
	connectorKey: string | null;
	methodId: MethodDTO["id"] | null;
}

export type MyContext = Context &
	SessionFlavor<SessionData> &
	ConversationFlavor<Context>;

export type MyConversationContext = MyContext;
export type MyConversation = Conversation<MyContext, MyConversationContext>;

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("💔 BOT_TOKEN is missing in .env");

export const bot = new Bot<MyContext>(token, {});

bot.api.config.use(apiThrottler());
bot.api.config.use(autoRetry());

bot.use(
	session({
		initial: (): SessionData => ({
			projectId: null,
			connectorId: null,
			providerKey: null,
			domainId: null,
			connectorKey: null,
			methodId: null,
		}),
	}),
);
bot.use(conversations());

bot.use(start);
bot.use(projects);
bot.use(domains);
bot.use(connectors);
bot.use(providers);
bot.use(payments);
bot.use(methods);

export const botNotify = {
	payment: async (payment: PaymentDTO) => {
		const chatId = process.env.BOT_NOTIFICATION_CHAT_ID;
		if (!chatId)
			throw new Error("💔 BOT_NOTIFICATION_CHAT_ID is missing in .env");
		const { message } = await viewPayment(payment);
		await bot.api.sendMessage(chatId, message, {
			parse_mode: "HTML",
		});
	},
};

bot.catch((err) => {
	console.log(err.error);
});
