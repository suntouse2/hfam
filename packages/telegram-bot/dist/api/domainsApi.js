import { api } from "./api.js";
export const domainsApi = {
    async getDomains (filters) {
        return api.get('domains', {
            searchParams: filters
        }).json();
    },
    async createDomain (data) {
        return api.post('domains', {
            json: data
        }).json();
    },
    async deleteDomain (id) {
        return api.delete(`domains/${id}`).json();
    }
};
