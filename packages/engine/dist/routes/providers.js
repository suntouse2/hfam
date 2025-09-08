import { providers as p } from "../providers/index.js";
import { providersFindSchema } from "@hfam/shared/validation/provider";
import { Router } from "express";
import z from "zod";
export const providers = Router();
providers.get('/', async (req, res)=>{
    const filters = providersFindSchema.parse(req.query);
    const providers = p.getProviders(filters);
    res.json(providers);
});
providers.get('/:key', async (req, res)=>{
    const key = z.string().trim().max(64).parse(req.params.key);
    const provider = p.getProvider(key);
    res.json(provider);
});
