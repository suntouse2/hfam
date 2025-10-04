/** biome-ignore-all lint/style/noNonNullAssertion: no need */
import { createConversation } from "@grammyjs/conversations";
import { Composer } from "grammy";
import { methodsApi } from "@/api/methodsApi";
import type { MyContext } from "@/bot";
import createMethod from "@/conversations/createMethod";
import { deleteMethod } from "@/conversations/deleteMethod";
import editMethodConnector from "@/conversations/editMethodConnector";
import editMethodMax from "@/conversations/editMethodMax";
import editMethodMethods from "@/conversations/editMethodMethods";
import editMethodMin from "@/conversations/editMethodMin";
import editMethodPosition from "@/conversations/editMethodPosition";
import editMethodProvider from "@/conversations/editMethodProvider";
import { viewMethod } from "@/views/Method";
import { viewsMethodsList } from "@/views/MethodsList";

export const methods = new Composer<MyContext>();

methods.use(createConversation(deleteMethod));
methods.use(createConversation(editMethodConnector));
methods.use(createConversation(editMethodProvider));
methods.use(createConversation(editMethodMethods));
methods.use(createConversation(editMethodMin));
methods.use(createConversation(editMethodMax));
methods.use(createConversation(createMethod));
methods.use(createConversation(editMethodPosition));

methods.callbackQuery("methods", async (ctx) => {
	await ctx.answerCallbackQuery();
	const projectId = ctx.session.projectId;
	if (!projectId) return;
	const { message, kb } = await viewsMethodsList(projectId);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });
});
methods.callbackQuery("methods:create", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("createMethod");
});

methods.callbackQuery(/^method:id-(.+)$/, async (ctx) => {
	await ctx.answerCallbackQuery();
	const methodId = Number(ctx.match![1]);
	ctx.session.methodId = methodId;
	const { message, kb } = await viewMethod(methodId);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });
});

methods.callbackQuery("method:active", async (ctx) => {
	await ctx.answerCallbackQuery();
	const methodId = ctx.session.methodId;
	if (!methodId) return;

	await methodsApi.updateMethod(methodId, { active: true });
	const { message, kb } = await viewMethod(methodId);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });
});

methods.callbackQuery("method:stop", async (ctx) => {
	await ctx.answerCallbackQuery();
	const methodId = ctx.session.methodId;
	if (!methodId) return;

	await methodsApi.updateMethod(methodId, { active: false });
	const { message, kb } = await viewMethod(methodId);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });
});
methods.callbackQuery("method:delete", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("deleteMethod");
});

methods.callbackQuery("method:configure:connector", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("editMethodConnector");
});

methods.callbackQuery("method:configure:provider", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("editMethodProvider");
});

methods.callbackQuery("method:configure:methods", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("editMethodMethods");
});

methods.callbackQuery("method:configure:minAmount", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("editMethodMin");
});

methods.callbackQuery("method:configure:maxAmount", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("editMethodMax");
});
methods.callbackQuery("method:configure:position", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("editMethodPosition");
});

methods.callbackQuery("method:configure:label", async (ctx) => {
	await ctx.answerCallbackQuery();
	await ctx.conversation.enter("editMethodLabel");
});
methods.callbackQuery("method:configure:showLabel:true", async (ctx) => {
	await ctx.answerCallbackQuery();
	const methodId = ctx.session.methodId;
	if (!methodId) return;
	await methodsApi.updateMethod(methodId, { showLabel: true });
	const { message, kb } = await viewMethod(methodId);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });
});
methods.callbackQuery("method:configure:showLabel:false", async (ctx) => {
	await ctx.answerCallbackQuery();
	const methodId = ctx.session.methodId;
	if (!methodId) return;
	await methodsApi.updateMethod(methodId, { showLabel: false });
	const { message, kb } = await viewMethod(methodId);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });
});
