import { projectsService } from "../services/projectService.js";
import { projectCreateSchema, projectUpdateSchema } from "@hfam/shared/validation/projects";
import { Router } from "express";
import z from "zod";
export const projects = Router();
projects.get('/', async (req, res)=>{
    const projects = await projectsService.getProjects();
    res.json(projects);
});
projects.post('/', async (req, res)=>{
    const data = projectCreateSchema.parse(req.body);
    const project = await projectsService.createProject(data);
    res.json(project);
});
projects.get('/:id', async (req, res)=>{
    const id = z.coerce.number().nonnegative().parse(req.params.id);
    const project = await projectsService.getProject(id);
    res.json(project);
});
projects.delete('/:id', async (req, res)=>{
    const id = z.coerce.number().nonnegative().parse(req.params.id);
    const project = await projectsService.deleteProject(id);
    res.json(project);
});
projects.patch('/:id', async (req, res)=>{
    const id = z.coerce.number().nonnegative().parse(req.params.id);
    const data = projectUpdateSchema.parse(req.body);
    const project = await projectsService.updateProject(id, data);
    res.json(project);
});
