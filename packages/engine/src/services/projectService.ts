import type { ProjectDTO } from "@hfam/shared/dto/index";
import type {
	projectCreateSchema,
	projectUpdateSchema,
} from "@hfam/shared/validation/projects";
import type z from "zod";
import prisma from "@/prisma";

type ProjectCreatePayload = z.infer<typeof projectCreateSchema>;
type ProjectUpdatePayload = z.infer<typeof projectUpdateSchema>;

export const projectsService = {
	async getProjects(): Promise<ProjectDTO[]> {
		const projects = await prisma.project.findMany({
			include: { methods: true },
		});
		return projects as ProjectDTO[];
	},
	async createProject({ name }: ProjectCreatePayload): Promise<ProjectDTO> {
		const project = await prisma.project.create({
			data: { name },
			include: { methods: true },
		});
		return project as ProjectDTO;
	},
	async deleteProject(id: ProjectDTO["id"]): Promise<ProjectDTO> {
		const project = await prisma.project.delete({
			where: { id },
			include: { methods: true },
		});
		return project as ProjectDTO;
	},
	async getProject(id: ProjectDTO["id"]): Promise<ProjectDTO> {
		const project = await prisma.project.findUniqueOrThrow({
			where: { id },
			include: { methods: true },
		});
		return project as ProjectDTO;
	},
	async updateProject(
		id: ProjectDTO["id"],
		payload: Partial<ProjectUpdatePayload>,
	): Promise<ProjectDTO> {
		const project = await prisma.project.update({
			where: { id },
			include: { methods: true },
			data: payload,
		});
		return project as ProjectDTO;
	},
};
