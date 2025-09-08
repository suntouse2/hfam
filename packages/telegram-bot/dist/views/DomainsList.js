import { domainsApi } from "../api/domainsApi.js";
import { projectsApi } from "../api/projectsApi.js";
import { InlineKeyboard } from "grammy";
export async function viewDomainsList(projectId) {
    const domains = await domainsApi.getDomains({
        projectId: projectId ?? undefined
    });
    let project;
    if (projectId) project = await projectsApi.getProject(projectId);
    const kb = new InlineKeyboard();
    domains.forEach((d)=>{
        kb.text(`❌ ${d.value}`, `domain:id-${d.id}`).row();
    });
    kb.text('➕ Добавить домен', `domains:add`).row();
    kb.text('⬅️ Назад', project ? `project:id-${project?.id}` : `projects`);
    const lines = [
        project && `📁 <b>${project.name}</b> #${project.id}`,
        ``,
        `🔗 Список активных доменов:`,
        `${domains.map((d)=>`▫️ ${d.value}`).join('\n')}`
    ];
    return {
        message: lines.join('\n'),
        kb
    };
}
