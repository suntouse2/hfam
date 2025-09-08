import { DOMAIN } from "@hfam/shared";
export const handlePayCbLink = (connectorId)=>{
    return `${DOMAIN}/payments/callback/${connectorId}`;
};
