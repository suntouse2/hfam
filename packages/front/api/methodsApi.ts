import type { MethodDTO } from "@hfam/shared/dto/index";
import type {
	methodCreateSchema,
	methodsFindSchema,
	methodUpdateSchema,
} from "@hfam/shared/validation/methods";
import type { z } from "zod";
import { api } from "./api";

type MethodsFindPayload = z.infer<typeof methodsFindSchema>;
type MethodCreatePayload = z.infer<typeof methodCreateSchema>;
type MethodUpdatePayload = z.infer<typeof methodUpdateSchema>;

export const methodsApi = {
	async getMethods(filters?: MethodsFindPayload) {
		return api.get("methods", { searchParams: filters }).json<MethodDTO[]>();
	},

	async getMethod(id: MethodDTO["id"]) {
		return api.get(`methods/${id}`).json<MethodDTO>();
	},

	async createMethod(data: MethodCreatePayload) {
		return api.post("methods", { json: data }).json<MethodDTO>();
	},

	async updateMethod(id: MethodDTO["id"], data: MethodUpdatePayload) {
		return api.patch(`methods/${id}`, { json: data }).json<MethodDTO>();
	},

	async deleteMethod(id: MethodDTO["id"]) {
		return api.delete(`methods/${id}`).json<MethodDTO>();
	},
};
