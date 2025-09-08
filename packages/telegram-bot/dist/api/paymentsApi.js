import { api } from "./api.js";
export const paymentsApi = {
    async getPayments (filters, page, limit) {
        const searchParams = {
            ...filters,
            page,
            limit
        };
        return api.get('payments', {
            searchParams
        }).json();
    }
};
