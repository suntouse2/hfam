import { api } from "./api.js";
export const methodsApi = {
    async getMethods (filters) {
        return api.get('methods', {
            searchParams: filters
        }).json();
    },
    async getMethod (id) {
        return api.get(`methods/${id}`).json();
    },
    async createMethod (data) {
        return api.post('methods', {
            json: data
        }).json();
    },
    async updateMethod (id, data) {
        return api.patch(`methods/${id}`, {
            json: data
        }).json();
    },
    async deleteMethod (id) {
        return api.delete(`methods/${id}`).json();
    }
};
