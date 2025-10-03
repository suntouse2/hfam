import type { ConnectorDTO } from "@hfam/shared/dto/index";
import type {
	connectorCreateSchema,
	connectorsFindSchema,
	connectorUpdateSchema,
} from "@hfam/shared/validation/connectors";
import type { z } from "zod";
import { api } from "./api";

type ConnectorsFindPayload = z.infer<typeof connectorsFindSchema>;
type ConnectorCreatePayload = z.infer<typeof connectorCreateSchema>;
type ConnectorUpdatePayload = z.infer<typeof connectorUpdateSchema>;

export const connectorsApi = {
	async getConnectors(filters?: ConnectorsFindPayload) {
		return api
			.get("connectors", { searchParams: filters })
			.json<ConnectorDTO[]>();
	},

	async getConnector(id: ConnectorDTO["id"]) {
		return api.get(`connectors/${id}`).json<ConnectorDTO>();
	},

	async createConnector(data: ConnectorCreatePayload) {
		return api.post("connectors", { json: data }).json<ConnectorDTO>();
	},

	async updateConnector(id: ConnectorDTO["id"], data: ConnectorUpdatePayload) {
		return api.patch(`connectors/${id}`, { json: data }).json<ConnectorDTO>();
	},

	async deleteConnector(id: ConnectorDTO["id"]) {
		return api.delete(`connectors/${id}`).json<ConnectorDTO>();
	},
	async getConnectorCallbackPath(id: ConnectorDTO["id"]) {
		return api.get(`connectors/${id}/callback`).json<{ url: string }>();
	},
};
