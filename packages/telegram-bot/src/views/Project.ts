import type { ProjectDTO } from "@hfam/shared/dto/index";
import { InlineKeyboard } from "grammy";
import { connectorsApi } from "@/api/connectorsApi";
import { domainsApi } from "@/api/domainsApi";
import { projectsApi } from "@/api/projectsApi";
import type { MyContext } from "@/bot";

export async function viewProject(projectId: ProjectDTO["id"]) {
	const project = await projectsApi.getProject(projectId);
	const domains = await domainsApi.getDomains({ projectId });
	const connectors = await connectorsApi.getConnectors({
		projectId,
		active: true,
	});

	const lines = [
		`📁 <b>${project.name}</b> (ID: ${project.id})`,
		"",
		`🔗 <b>Активных доменов:</b> ${domains.length}`,
		`🌐 <b>Активных провайдеров:</b> ${connectors.length}`,
		"",
	];

	const kb = new InlineKeyboard()
		.text("🔗 Домены", `domains`)
		.text("🌐 Провайдеры", `connectors`)
		.row()
		.text("💳 Методы", "methods")
		.row()
		.text(
			`🤖 Ссылка поддержки: ${project.supportLink}`,
			`project:configure:supportLink`,
		)
		.row()
		.text("⛔ Удалить проект", `project:delete`)
		.row()
		.text("⬅️ Назад", `projects`);

	return { message: lines.join("\n"), kb };
}
