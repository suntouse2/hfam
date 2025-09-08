import { methodsApi } from "../api/methodsApi.js";
import { viewMethod } from "../views/Method.js";
import { viewsMethodsList } from "../views/MethodsList.js";
import { Composer } from "grammy";
import { createConversation } from "@grammyjs/conversations";
import { deleteMethod } from "../conversations/deleteMethod.js";
import editMethodConnector from "../conversations/editMethodConnector.js";
import editMethodProvider from "../conversations/editMethodProvider.js";
import editMethodMethods from "../conversations/editMethodMethods.js";
import editMethodMin from "../conversations/editMethodMin.js";
import editMethodMax from "../conversations/editMethodMax.js";
import createMethod from "../conversations/createMethod.js";
export const methods = new Composer();
methods.use(createConversation(deleteMethod));
methods.use(createConversation(editMethodConnector));
methods.use(createConversation(editMethodProvider));
methods.use(createConversation(editMethodMethods));
methods.use(createConversation(editMethodMin));
methods.use(createConversation(editMethodMax));
methods.use(createConversation(createMethod));
methods.callbackQuery('methods', async (ctx)=>{
    await ctx.answerCallbackQuery();
    const projectId = ctx.session.projectId;
    if (!projectId) return;
    const { message, kb } = await viewsMethodsList(projectId);
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
methods.callbackQuery('methods:create', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('createMethod');
});
methods.callbackQuery(/^method:id-(.+)$/, async (ctx)=>{
    await ctx.answerCallbackQuery();
    const methodId = Number(ctx.match[1]);
    ctx.session.methodId = methodId;
    const { message, kb } = await viewMethod(methodId);
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
methods.callbackQuery('method:active', async (ctx)=>{
    await ctx.answerCallbackQuery();
    const methodId = ctx.session.methodId;
    if (!methodId) return;
    await methodsApi.updateMethod(methodId, {
        active: true
    });
    const { message, kb } = await viewMethod(methodId);
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
methods.callbackQuery('method:stop', async (ctx)=>{
    await ctx.answerCallbackQuery();
    const methodId = ctx.session.methodId;
    if (!methodId) return;
    await methodsApi.updateMethod(methodId, {
        active: false
    });
    const { message, kb } = await viewMethod(methodId);
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
methods.callbackQuery('method:delete', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('deleteMethod');
});
methods.callbackQuery('method:configure:connector', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('editMethodConnector');
});
methods.callbackQuery('method:configure:provider', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('editMethodProvider');
});
methods.callbackQuery('method:configure:methods', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('editMethodMethods');
});
methods.callbackQuery('method:configure:minAmount', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('editMethodMin');
});
methods.callbackQuery('method:configure:maxAmount', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('editMethodMax');
});
methods.callbackQuery('method:configure:label', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('editMethodLabel');
});
methods.callbackQuery('method:configure:showLabel:true', async (ctx)=>{
    await ctx.answerCallbackQuery();
    const methodId = ctx.session.methodId;
    if (!methodId) return;
    await methodsApi.updateMethod(methodId, {
        showLabel: true
    });
    const { message, kb } = await viewMethod(methodId);
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
methods.callbackQuery('method:configure:showLabel:false', async (ctx)=>{
    await ctx.answerCallbackQuery();
    const methodId = ctx.session.methodId;
    if (!methodId) return;
    await methodsApi.updateMethod(methodId, {
        showLabel: false
    });
    const { message, kb } = await viewMethod(methodId);
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
