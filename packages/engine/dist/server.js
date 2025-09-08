import express from "express";
import "dotenv/config";
import { error } from "./middlewares/error.js";
import { auth } from "./middlewares/auth.js";
import { projects } from "./routes/projects.js";
import { providers } from "./routes/providers.js";
import { connectors } from "./routes/connectors.js";
import { domains } from "./routes/domains.js";
import { payments } from "./routes/payments.js";
import { pay } from "./routes/pay.js";
import { methods } from "./routes/methods.js";
import { gateway } from "./routes/gateway.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import helmet from "helmet";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const server = express();
server.use(helmet());
server.use('/static', express.static(join(__dirname, '../public')));
server.set('view engine', 'ejs');
server.set('views', join(__dirname, '../views'));
server.use(express.json({
    limit: '1mb'
}));
server.use(express.urlencoded({
    extended: true,
    limit: '1mb'
}));
server.use('/payments', auth, payments);
server.use('/projects', auth, projects);
server.use('/providers', auth, providers);
server.use('/connectors', auth, connectors);
server.use('/domains', auth, domains);
server.use('/methods', auth, methods);
server.use('/pay', auth, pay);
server.use('/gateway', gateway);
//prettier-ignore
server.get('/ping', (_req, res)=>{
    res.send('pong');
});
server.use(error);
