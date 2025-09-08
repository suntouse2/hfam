import { connectorsApi } from "../api/connectorsApi.js";
import { projectsApi } from "../api/projectsApi.js";
import { connectorSchemaSchema } from "@hfam/shared/validation/connectors";
import { InlineKeyboard } from "grammy";
export async function viewConnectorsList(projectId) {
    const connectors = await connectorsApi.getConnectors({
        projectId: projectId ?? undefined
    });
    let project;
    if (projectId) project = await projectsApi.getProject(projectId);
    const lines = [
        project && `📁 <b>${project.name}</b> (ID: ${project.id})`,
        ``,
        `🌐 Подключенные провайдеры:`
    ];
    const kb = new InlineKeyboard();
    connectors.forEach((c)=>{
        const state = c.active ? '🟢 Включен' : '⭕ Выключен';
        const scheme = connectorSchemaSchema.parse(c.schema);
        const notConfigured = Object.values(scheme).some((s)=>!s.value);
        const label = notConfigured ? `${c.name}  (ID: ${c.id}) ┃ ⚙️ Не настроен` : `${c.name}  (ID: ${c.id}) ┃ ${state}`;
        kb.text(label, `connector:id-${c.id}`).row();
    });
    kb.text('➕ Подключить провайдер ', `providers`).row();
    kb.text('🧪 Тест платежа', `payments:test`).row();
    kb.text('⬅️ Назад', project ? `project:id-${projectId}` : `projects`);
    return {
        message: lines.join('\n'),
        kb
    };
}
