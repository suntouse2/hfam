import { providersApi } from "../api/providersApi.js";
import { InlineKeyboard } from "grammy";
export async function viewProvidersList() {
    const lines = [
        `🌐 Доступные провайдеры:`
    ];
    const providers = await providersApi.getProviders({
        active: true
    });
    const kb = new InlineKeyboard();
    providers.forEach((p)=>{
        let label;
        label = `${p.title} ┃ 🔌 Подключить`;
        kb.text(label, `provider:key-${p.key}`).row();
    });
    kb.text('⬅️ Назад', `connectors`);
    return {
        message: lines.join('\n'),
        kb
    };
}
