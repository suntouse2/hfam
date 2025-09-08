import prisma from "../prisma.js";
export const projectsService = {
    async getProjects () {
        const projects = await prisma.project.findMany({
            include: {
                methods: true
            }
        });
        return projects;
    },
    async createProject ({ name }) {
        const project = await prisma.project.create({
            data: {
                name
            },
            include: {
                methods: true
            }
        });
        return project;
    },
    async deleteProject (id) {
        const project = await prisma.project.delete({
            where: {
                id
            },
            include: {
                methods: true
            }
        });
        return project;
    },
    async getProject (id) {
        const project = await prisma.project.findUniqueOrThrow({
            where: {
                id
            },
            include: {
                methods: true
            }
        });
        return project;
    },
    async updateProject (id, payload) {
        const project = await prisma.project.update({
            where: {
                id
            },
            include: {
                methods: true
            },
            data: payload
        });
        return project;
    }
};
