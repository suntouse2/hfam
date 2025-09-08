import { Bot, session } from "grammy";
import "dotenv/config";
import { conversations } from "@grammyjs/conversations";
import { apiThrottler } from "@grammyjs/transformer-throttler";
import { autoRetry } from "@grammyjs/auto-retry";
import { start } from "./features/start.js";
import { projects } from "./features/projects.js";
import { domains } from "./features/domains.js";
import { connectors } from "./features/connectors.js";
import { providers } from "./features/providers.js";
import { payments } from "./features/payments.js";
import { methods } from "./features/methods.js";
const token = process.env.BOT_TOKEN;
if (!token) throw new Error('💔 BOT_TOKEN is missing in .env');
export const bot = new Bot(token, {});
bot.api.config.use(apiThrottler());
bot.api.config.use(autoRetry());
bot.use(session({
    initial: ()=>({
            projectId: null,
            connectorId: null,
            providerKey: null,
            domainId: null,
            connectorKey: null,
            methodId: null
        })
}));
bot.use(conversations());
bot.use(start);
bot.use(projects);
bot.use(domains);
bot.use(connectors);
bot.use(providers);
bot.use(payments);
bot.use(methods);
bot.catch((err)=>{
    console.log(err.error);
});
