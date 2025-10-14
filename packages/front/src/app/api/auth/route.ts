import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const api_key = searchParams.get("api_key");

	if (!api_key) {
		return NextResponse.json({ error: "Missing api_key" }, { status: 400 });
	}

	const res = NextResponse.redirect(new URL("/payments", req.url));
	res.cookies.set("token", api_key, {
		httpOnly: true,
		secure: true,
		path: "/",
		maxAge: 60 * 60 * 24,
	});

	return res;
}
