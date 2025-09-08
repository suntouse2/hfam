import { api } from "./api.js";
export const payApi = {
    async pay (payload) {
        return api.post('pay', {
            json: payload
        }).json();
    }
};
