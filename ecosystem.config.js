module.exports = {
	apps: [
		{
			name: "engine",
			cwd: "packages/engine",
			script: "npm",
			args: "run start",
		},
		{
			name: "telegram-bot",
			cwd: "packages/telegram-bot",
			script: "npm",
			args: "run start",
		},
		{
			name: "front",
			cwd: "packages/front",
			script: "npm",
			args: "run start",
		},
	],
};
