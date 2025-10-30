import { InlineKeyboard } from "grammy";
import { projectsApi } from "@/api/projectsApi";
import type { MyConversation, MyConversationContext } from "@/bot";
import { viewProject } from "@/views/Project";

export default async function editProjectSupportLink(
	conversation: MyConversation,
	ctx: MyConversationContext,
) {
	const { projectId } = await conversation.external((ctx) => ctx.session);
	if (!projectId) return;

	await conversation.external(() => projectsApi.getProject(projectId));

	const sent = await ctx.reply(`✏️ Введите ссылку поддержки:`, {
		reply_markup: new InlineKeyboard().text("⬅️ Назад", "noop"),
	});
	const response = await conversation.waitFor([":text", "callback_query"]);
	await ctx.api.deleteMessage(sent.chat.id, sent.message_id);

	if (response.has("callback_query")) await response.answerCallbackQuery();
	if (response.has("message:text")) {
		await response.deleteMessage();
		await conversation.external(async () => {
			await projectsApi.updateProject(projectId, {
				supportLink: response.message.text.replace("@", ""),
			});
		});
	}

	const { message, kb } = await conversation.external(() =>
		viewProject(projectId),
	);
	await ctx.editMessageText(message, { reply_markup: kb, parse_mode: "HTML" });

	return;
}
