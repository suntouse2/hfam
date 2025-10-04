import { DOMAIN } from "@hfam/shared"; // например: https://360payments.biz
import { NextResponse } from "next/server";
import { paramsSchema } from "@/z/z";

export const POST = async (req: Request) => {
	try {
		// 1. Получаем FormData
		const formData = await req.formData();
		const body = Object.fromEntries(formData.entries());

		// 2. Валидируем
		const params = paramsSchema.parse(body);

		// 3. Собираем querystring
		const searchParams = new URLSearchParams(
			Object.entries(params)
				.filter(([_, v]) => v != null)
				.map(([k, v]) => [k, String(v)]),
		);

		const redirectUrl = `${DOMAIN}/gateway?${searchParams}`;

		return NextResponse.redirect(redirectUrl, { status: 302 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}
};
