import { createProject } from "../conversations/createProject.js";
import { deleteProject } from "../conversations/deleteProject.js";
import { viewProject } from "../views/Project.js";
import { viewProjectList } from "../views/ProjectList.js";
import { createConversation } from "@grammyjs/conversations";
import { Composer } from "grammy";
export const projects = new Composer();
projects.use(createConversation(createProject));
projects.use(createConversation(deleteProject));
projects.callbackQuery('projects', async (ctx)=>{
    await ctx.answerCallbackQuery();
    const { message, kb } = await viewProjectList();
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
projects.callbackQuery('projects:create', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('createProject');
});
projects.callbackQuery('project:delete', async (ctx)=>{
    await ctx.answerCallbackQuery();
    await ctx.conversation.enter('deleteProject');
});
projects.callbackQuery(/^project:id-(.+)$/, async (ctx)=>{
    await ctx.answerCallbackQuery();
    const projectId = Number(ctx.match[1]);
    ctx.session.projectId = projectId;
    const { message, kb } = await viewProject(ctx.session.projectId);
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
