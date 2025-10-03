import express from "express";
import "dotenv/config";

import helmet from "helmet";
import { error } from "@/middlewares/error";
import { auth } from "./middlewares/auth";
import { connectors } from "./routes/connectors";
import { domains } from "./routes/domains";
import { methods } from "./routes/methods";
import { pay } from "./routes/pay";
import { payments } from "./routes/payments";
import { projects } from "./routes/projects";
import { providers } from "./routes/providers";

export const server = express();

server.use(helmet({ contentSecurityPolicy: false }));

server.use(express.json({ limit: "1mb" }));
server.use(express.urlencoded({ extended: true, limit: "1mb" }));

server.use("/payments", auth, payments);
server.use("/projects", auth, projects);
server.use("/providers", auth, providers);
server.use("/connectors", auth, connectors);
server.use("/domains", auth, domains);
server.use("/methods", auth, methods);
server.use("/pay", pay);

//prettier-ignore
server.get("/ping", (_req, res) => {
	res.send("pong");
});

server.use(error);
