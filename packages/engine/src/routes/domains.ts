import {
	domainCreateSchema,
	domainsFindSchema,
} from "@hfam/shared/validation/domains";
import { Router } from "express";
import z from "zod";
import { domainsService } from "@/services/domainsService";

export const domains = Router();

domains.get("", async (req, res) => {
	const data = domainsFindSchema.parse(req.query);
	const domains = await domainsService.getDomains(data);
	res.json(domains);
});

domains.post("", async (req, res) => {
	const data = domainCreateSchema.parse(req.body);
	const domain = await domainsService.createDomain(data);
	res.json(domain);
});

domains.delete("/:id", async (req, res) => {
	const id = z.coerce.number().nonnegative().parse(req.params.id);
	const domain = await domainsService.deleteDomain(id);
	res.json(domain);
});
