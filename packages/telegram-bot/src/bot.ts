import { Bot, session } from 'grammy'
import 'dotenv/config'
import type { Context, SessionFlavor } from 'grammy'
import {
	Conversation,
	conversations,
	type ConversationFlavor,
} from '@grammyjs/conversations'
import { apiThrottler } from '@grammyjs/transformer-throttler'
import { autoRetry } from '@grammyjs/auto-retry'
import { start } from './features/start'
import { projects } from './features/projects'

interface SessionData {
	projectId: number | null
	providerId: number | null
	domainIdx: number | null
}

export type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor<Context>

export type MyConversationContext = MyContext
export type MyConversation = Conversation<MyContext, MyConversationContext>

const token = process.env.BOT_TOKEN
if (!token) throw new Error('💔 BOT_TOKEN is missing in .env')

export const bot = new Bot<MyContext>(token, {})

bot.api.config.use(apiThrottler())
bot.api.config.use(autoRetry())

bot.use(
	session({
		initial: (): SessionData => ({ projectId: null, providerId: null, domainIdx: null }),
	})
)
bot.use(conversations())

bot.use(start)
bot.use(projects)

bot.catch(e => {
	console.log(e.error)
})
