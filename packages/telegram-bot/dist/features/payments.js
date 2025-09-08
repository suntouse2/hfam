import { connectorsApi } from "../api/connectorsApi.js";
import { domainsApi } from "../api/domainsApi.js";
import { payApi } from "../api/payApi.js";
import viewPaymentsList from "../views/PaymentsList.js";
import viewPaymentTest from "../views/PaymentTest.js";
import { HTTPError } from "got";
import { Composer } from "grammy";
import { nanoid } from "nanoid";
export const payments = new Composer();
payments.callbackQuery(/^payments:(\d+)$/, async (ctx)=>{
    await ctx.answerCallbackQuery();
    const { projectId } = ctx.session;
    if (!projectId) return;
    const page = parseInt(ctx.match[1], 10) || 1;
    const { message, kb } = await viewPaymentsList(projectId, page);
    await ctx.editMessageText(message, {
        reply_markup: kb,
        parse_mode: 'HTML'
    });
});
payments.callbackQuery('payments:test', async (ctx)=>{
    await ctx.answerCallbackQuery();
    const { projectId } = ctx.session;
    if (!projectId) return;
    const domains = await domainsApi.getDomains({
        projectId
    });
    const connectors = await connectorsApi.getConnectors({
        projectId,
        active: true
    });
    if (!connectors.length) return ctx.reply('😔 Нет доступных провайдеров');
    const statuses = connectors.map((c)=>({
            connector: c,
            status: '⏳ Ожидание платежа',
            paymentUuid: null
        }));
    if (!domains.length) return ctx.reply('😔 Нет доступных доменов');
    const update = async (id, status, uuid)=>{
        const s = statuses.find((v)=>v.connector.id === id);
        if (!s) return;
        Object.assign(s, {
            status,
            paymentUuid: uuid
        });
        const { message, kb } = viewPaymentTest(statuses);
        await ctx.editMessageText(message, {
            reply_markup: kb,
            parse_mode: 'HTML'
        });
    };
    for (const c of connectors){
        await update(c.id, '🔄 Создание платежа', null);
        try {
            const p = await payApi.pay({
                domain: domains[0]?.value || '',
                orderId: nanoid(),
                amount: 100,
                description: 'Тестовый платёж',
                projectId,
                connectorId: c.id
            });
            await update(c.id, '✅ Платёж создан', p.id);
        } catch (e) {
            const msg = e instanceof HTTPError && e.response.body?.error ? e.response.body.error : 'Ошибка';
            await update(c.id, '❌ ' + msg, null);
        }
    }
});
