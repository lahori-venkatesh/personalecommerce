const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // Update 'Mock Interview' service to require slots
    // We'll search by title containing 'Mock' to be safe
    const services = await prisma.service.findMany({
      where: {
        title: {
          contains: 'Mock',
          mode: 'insensitive'
        }
      }
    })

    console.log(`Found ${services.length} services matching 'Mock'`)

    for (const service of services) {
      const updated = await prisma.service.update({
        where: { id: service.id },
        data: { requiresSlot: true }
      })
      console.log(`Updated service: ${updated.title} (ID: ${updated.id}) to requiresSlot: true`)
    }

    // Also update '1:1 Session' if it exists
    const sessions = await prisma.service.findMany({
      where: {
        title: {
          contains: 'Session',
          mode: 'insensitive'
        }
      }
    })

    for (const service of sessions) {
      const updated = await prisma.service.update({
        where: { id: service.id },
        data: { requiresSlot: true }
      })
      console.log(`Updated service: ${updated.title} (ID: ${updated.id}) to requiresSlot: true`)
    }

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
