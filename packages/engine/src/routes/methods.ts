import {
	methodCreateSchema,
	methodsFindSchema,
	methodUpdateSchema,
} from "@hfam/shared/validation/methods";
import { Router } from "express";
import z from "zod";
import { methodsService } from "@/services/methodsService";

export const methods = Router();

methods.get("/", async (req, res) => {
	const filters = methodsFindSchema.parse(req.query);
	const methods = await methodsService.getMethods(filters);
	res.json(methods);
});
methods.get("/:id", async (req, res) => {
	const id = z.coerce.number().nonnegative().parse(req.params.id);
	const method = await methodsService.getMethod(id);
	res.json(method);
});
methods.post("/", async (req, res) => {
	const data = methodCreateSchema.parse(req.body);
	const method = await methodsService.createMethod(data);
	res.json(method);
});
methods.delete("/:id", async (req, res) => {
	const id = z.coerce.number().nonnegative().parse(req.params.id);
	const method = await methodsService.deleteMethod(id);
	res.json(method);
});
methods.patch("/:id", async (req, res) => {
	const id = z.coerce.number().nonnegative().parse(req.params.id);
	const data = methodUpdateSchema.parse(req.body);
	const method = await methodsService.updateMethod(id, data);
	res.json(method);
});
