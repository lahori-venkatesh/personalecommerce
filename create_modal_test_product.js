const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const product = await prisma.product.create({
      data: {
        title: 'Modal Test Product',
        description: 'Short description for the card.',
        detailedDescription: 'This is the detailed description that should appear in the modal. It should be long enough to demonstrate scrolling if needed. \n\nIt contains multiple paragraphs and detailed information about the product.',
        excerpt: 'Short excerpt',
        price: 199.99,
        rating: 4.8,
        soldCount: 25,
        category: 'Interview Question',
        isBestSeller: false,
        isPopular: true,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
        previewUrl: 'https://example.com/preview.pdf',
        fileUrl: 'https://example.com/file.pdf'
      }
    })
    console.log('Created product:', product)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
