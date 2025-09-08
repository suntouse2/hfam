import { api } from "./api.js";
export const projectsApi = {
    async getProjects () {
        return api.get('projects').json();
    },
    async createProject (data) {
        return api.post('projects', {
            json: data
        }).json();
    },
    async getProject (id) {
        return api.get(`projects/${id}`).json();
    },
    async deleteProject (id) {
        return api.delete(`projects/${id}`).json();
    },
    async updateProject (id, data) {
        return api.patch(`projects/${id}`, {
            json: data
        }).json();
    }
};
