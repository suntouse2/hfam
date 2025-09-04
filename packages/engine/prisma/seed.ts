import { PrismaClient } from '@prisma/client'
import { providers } from './seeds/providers'
const prisma = new PrismaClient()

async function main() {
	//providers
	for (const p of providers) {
		await prisma.provider.upsert({
			where: { key: p.key },
			update: p,
			create: p,
		})
	}
}
main().finally(() => prisma.$disconnect())
