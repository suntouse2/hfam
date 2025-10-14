"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function checkApi() {
	const cooks = await cookies();
	const token = cooks.get("token")?.value;

	const validKey = process.env.API_KEY;

	if (!validKey || !token || token !== validKey) {
		redirect("/");
	}
}
