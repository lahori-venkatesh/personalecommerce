const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const service = await prisma.service.create({
      data: {
        title: "Test Service",
        description: "Test Description",
        price: 100,
        category: "Other",
        requiredInput: "None",
        salesCount: 0,
        showSalesCount: false,
        autoIncrementSales: false,
        isPopular: false,
        isBestSeller: false,
        includes: JSON.stringify(["Test"]),
        features: JSON.stringify(["Feature"])
      }
    })
    console.log('Created service:', service)
  } catch (error) {
    console.error('Error creating service:', error)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
