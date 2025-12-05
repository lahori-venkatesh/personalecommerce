const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const product = await prisma.product.create({
      data: {
        title: 'Test Product via Script',
        description: 'Short description for the card.',
        detailedDescription: 'This is a detailed description created via script to verify the frontend expansion logic. It should be visible when "View more details" is clicked.',
        excerpt: 'Short excerpt',
        price: 99.99,
        rating: 4.5,
        soldCount: 10,
        category: 'Notes',
        isBestSeller: true,
        isPopular: false,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
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
