import { api } from "./api.js";
export const connectorsApi = {
    async getConnectors (filters) {
        return api.get('connectors', {
            searchParams: filters
        }).json();
    },
    async getConnector (id) {
        return api.get(`connectors/${id}`).json();
    },
    async createConnector (data) {
        return api.post('connectors', {
            json: data
        }).json();
    },
    async updateConnector (id, data) {
        return api.patch(`connectors/${id}`, {
            json: data
        }).json();
    },
    async deleteConnector (id) {
        return api.delete(`connectors/${id}`).json();
    },
    async getConnectorCallbackPath (id) {
        return api.get(`connectors/${id}/callback`).json();
    }
};
