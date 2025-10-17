const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

module.exports = {
	apps: [
		{
			name: "engine",
			cwd: "packages/engine",
			script: "npm",
			args: "run start",
			env: {
				NODE_ENV: "production",
				...process.env,
			},
		},
		{
			name: "telegram-bot",
			cwd: "packages/telegram-bot",
			script: "npm",
			args: "run start",
			env: {
				NODE_ENV: "production",
				...process.env,
			},
		},
		{
			name: "front",
			cwd: "packages/front",
			script: "npm",
			args: "run start",
			env: {
				NODE_ENV: "production",
				...process.env,
			},
		},
	],
};
