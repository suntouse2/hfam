import { api } from "./api.js";
export const providersApi = {
    async getProviders (filters) {
        const params = new URLSearchParams();
        Object.entries(filters ?? {}).forEach(([key, value])=>{
            if (value === undefined) return;
            if (Array.isArray(value)) {
                value.forEach((v)=>params.append(key, v));
            } else {
                params.set(key, String(value));
            }
        });
        return api.get('providers', {
            searchParams: params
        }).json();
    },
    async getProvider (key) {
        return api.get(`providers/${key}`).json();
    }
};
