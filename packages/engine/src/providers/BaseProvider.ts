import type { ConnectorDTO } from "@hfam/shared/dto/index";
import type { PaymentStatus } from "@prisma/client";
import type { Request } from "express";

export interface ProviderRequest {
	projectId: number;
	connector: ConnectorDTO;
	amount: number;
	description: string;
	orderId: string;
	domain: string;
	method?: string;
	payload?: Record<string, string>;
}
export interface ProviderCallback {
	connector: ConnectorDTO;
	request: Request;
}

export interface ProviderResponse {
	method?: string;
	paymentUrl?: string;
	paymentQr?: string;
	paymentId?: string;
	status?: PaymentStatus;
}

export interface BaseProvider {
	create(payload: ProviderRequest): Promise<ProviderResponse>;
	callback(payload: ProviderCallback): Promise<ProviderResponse>;
}
