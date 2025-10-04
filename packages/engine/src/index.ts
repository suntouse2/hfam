import { server } from "./server";

const PORT = process.env.ENGINE_PORT;

if (!PORT) {
	throw new Error("ENGINE_PORT is missing in .env");
}

server.listen(PORT, () => {
	console.log(`🧃 hfam-engine running at http://localhost:${PORT}`);
});
