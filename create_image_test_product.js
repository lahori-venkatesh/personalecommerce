const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const product = await prisma.product.create({
      data: {
        title: 'Image Test Product',
        description: 'This product should have an image on the card, but the modal should be text-only.',
        detailedDescription: 'Detailed description for the modal. No image here.',
        excerpt: 'Short description with image on card.',
        price: 59.99,
        rating: 4.5,
        soldCount: 20,
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
