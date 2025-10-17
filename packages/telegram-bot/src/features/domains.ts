import { createConversation } from "@grammyjs/conversations";
import { Composer } from "grammy";
import type { MyContext } from "@/bot";
import { addDomain } from "@/conversations/addDomain";
import { deleteDomain } from "@/conversations/deleteDomain";
import { viewDomainsList } from "@/views/DomainsList";

export const domains = new Composer<MyContext>();

domains.use(createConversation(addDomain));
domains.use(createConversation(deleteDomain));

domains.callbackQuery("domains", async (ctx) => {
	await ctx.answerCallbackQuery();
	const projectId = ctx.session.projectId;
	const { message, kb } = await viewDomainsList(projectId);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });
});
domains.callbackQuery("domains:add", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("addDomain");
});
domains.callbackQuery(/^domain:id-(.+)$/, async (ctx) => {
	await ctx.answerCallbackQuery();
	// biome-ignore lint/style/noNonNullAssertion: no need
	const domainId = Number(ctx.match![1]);
	ctx.session.domainId = domainId;
	await ctx.conversation.enter("deleteDomain");
});
