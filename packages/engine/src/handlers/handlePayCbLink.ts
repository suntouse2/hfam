import { DOMAIN } from "@hfam/shared";
import type { ConnectorDTO } from "@hfam/shared/dto/index";

export const handlePayCbLink = (connectorId: ConnectorDTO["id"]) => {
	return `${DOMAIN}/pay/callback/${connectorId}`;
};
