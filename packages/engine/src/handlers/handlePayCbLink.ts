import { DOMAIN } from "@hfam/shared";
import type { ConnectorDTO } from "@hfam/shared/dto/index";

export const handlePayCbLink = (connectorId: ConnectorDTO["id"]) => {
	return `${DOMAIN}/core/pay/callback/${connectorId}?token=${process.env.CALLBACK_KEY}`;
};
