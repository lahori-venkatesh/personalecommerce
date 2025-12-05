import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const service = await prisma.service.create({
    data: {
      title: 'Minimalist Sketch Resume',
      description: 'Clean and minimal resume template designed in Sketch for professionals.',
      price: 599,
      category: 'Resume Templates',
      includes: JSON.stringify(['Sketch File', 'PDF Guide', 'Free Fonts']),
      features: JSON.stringify(['Editable in Sketch', 'A4 Size', 'Print Ready']),
      platform: 'Sketch',
      resumePreviewImage: '/creative_resume_preview_1764879969629.png', // Reusing image for now
      resumeGuidePdf: 'https://example.com/guide.pdf',
      resumeTemplateLink: 'https://example.com/template',
      requiredInput: 'None',
      isPopular: false,
      showSalesCount: true,
      salesCount: 45
    },
  })
  console.log('Created service:', service)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
