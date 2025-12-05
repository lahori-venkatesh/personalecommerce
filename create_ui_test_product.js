const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const product = await prisma.product.create({
      data: {
        title: 'UI Test Product',
        description: 'This is a short description that should be truncated to two lines on the card. It needs to be long enough to demonstrate the line-clamp-2 functionality effectively.',
        detailedDescription: 'This is the detailed description for the modal. It should be visible when the modal is opened. There should be no image in the modal either.',
        excerpt: 'This is a short description that should be truncated to two lines on the card. It needs to be long enough to demonstrate the line-clamp-2 functionality effectively.',
        price: 49.99,
        rating: 4.2,
        soldCount: 15,
        category: 'Notes',
        isBestSeller: true,
        isPopular: false,
        isActive: true,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', // Image URL provided but should NOT be rendered
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
