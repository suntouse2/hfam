import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // разрешает все хосты
			},
		],
	},
};

export default nextConfig;
