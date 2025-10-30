import type { ProjectDTO } from "@hfam/shared/dto/index";
import type {
	projectCreateSchema,
	projectUpdateSchema,
} from "@hfam/shared/validation/projects";
import type { z } from "zod";
import { api } from "./api";

type ProjectCreatePayload = z.infer<typeof projectCreateSchema>;
type ProjectUpdatePayload = z.infer<typeof projectUpdateSchema>;

export const projectsApi = {
	async getProjects() {
		return api.get("projects").json<ProjectDTO[]>();
	},

	async createProject(data: ProjectCreatePayload) {
		return api.post("projects", { json: data }).json<ProjectDTO>();
	},

	async getProject(id: ProjectDTO["id"]) {
		return api.get(`projects/${id}`).json<ProjectDTO>();
	},

	async deleteProject(id: ProjectDTO["id"]) {
		return api.delete(`projects/${id}`).json<ProjectDTO>();
	},

	async updateProject(id: ProjectDTO["id"], data: ProjectUpdatePayload) {
		return api.patch(`projects/${id}`, { json: data }).json<any>();
	},
};
