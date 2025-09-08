import { projectsApi } from "../api/projectsApi.js";
import { InlineKeyboard } from "grammy";
export async function viewProjectList() {
    const projects = await projectsApi.getProjects();
    const kb = new InlineKeyboard();
    projects.forEach((p)=>{
        const label = `${p.name} (ID: ${p.id})`;
        kb.text(label, `project:id-${p.id}`).row();
    });
    kb.text('➕ Добавить проект', 'projects:create').row();
    kb.text('⬅️ Назад', `start`);
    return {
        message: '📂 Список ваших проектов:',
        kb
    };
}
