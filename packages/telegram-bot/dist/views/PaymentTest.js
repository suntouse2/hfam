import { InlineKeyboard } from "grammy";
export default function viewPaymentTest(connectorStatuses) {
    const lines = [
        '🔌 Тестирование платежей:\n\n'
    ];
    connectorStatuses.forEach((c)=>{
        lines.push(`• ${c.connector.name} — ${c.status}\n${c.paymentUuid ? `🔑 ${c.paymentUuid}` : ''}`);
    });
    const kb = new InlineKeyboard().text('⬅️ Назад', 'connectors');
    return {
        message: lines.join('\n'),
        kb
    };
}
