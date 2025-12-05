const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const deleteProduct = await prisma.product.deleteMany({
      where: {
        title: 'Modal Test Product'
      }
    })
    console.log('Deleted products:', deleteProduct)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
