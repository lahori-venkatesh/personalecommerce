const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const service = await prisma.service.create({
      data: {
        title: 'Modern Professional Resume',
        description: 'A clean, modern resume template designed for professionals in tech and business.',
        price: 499,
        category: 'Resume Templates',
        includes: JSON.stringify(['Figma Template', 'PDF Guide', 'ATS Friendly']),
        features: JSON.stringify(['Editable in Figma', 'Free Fonts Used']),
        resumePreviewImage: 'https://marketplace.canva.com/EAFRuCp3DcY/1/0/1131w/canva-black-white-minimalist-cv-resume-f5JNR-K5jjw.jpg',
        resumeGuidePdf: 'https://example.com/guide.pdf',
        resumeTemplateLink: 'https://example.com/template',
        platform: 'Canva',
        isActive: true
      }
    })
    console.log('Created resume template service:', service)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
