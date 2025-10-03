import { gatewayPayParams } from "@hfam/shared/validation/gateway";
import { NextResponse } from "next/server";
import { projectsApi } from "../../../../api/projectsApi";
import { methodsApi } from "../../../../api/methodsApi";
import { payApi } from "../../../../api/payApi";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const gateway = gatewayPayParams.parse(body);
    const project = await projectsApi.getProject(gateway.projectId);
    const method = await methodsApi.getMethod(gateway.methodId);

    if (!method.active) throw new Error("method is not active");

    const pay = await payApi.pay({
      projectId: project.id,
      orderId: gateway.orderId,
      amount: gateway.amount,
      description: gateway.description,
      domain: gateway.domain,
      connectorId: method.connectorId,
      byProvider: method.byProvider,
      payload: gateway.payload,
    });

    return NextResponse.json({
      paymentId: pay.paymentId,
      projectId: project.id,
      paymentUrl: pay.paymentUrl,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
