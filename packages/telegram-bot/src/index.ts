import { bot } from "./bot";
import { server } from "./server";

const PORT = process.env.BOT_PORT;
bot.start();

if (!PORT) {
	throw new Error("BOT_PORT is missing in .env");
}

server.listen(PORT, () => {
	console.log(`🧃 hfam-telegram-bot running at http://localhost:${PORT}`);
});
