import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse includes JSON strings
    const formattedServices = services.map(service => ({
      ...service,
      includes: JSON.parse(service.includes || '[]'),
      features: JSON.parse(service.features || '[]')
    }))

    return NextResponse.json(formattedServices)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      duration,
      format,
      price,
      includes,
      isActive,
      category,
      requiredInput,
      salesCount,
      showSalesCount,
      autoIncrementSales,
      isPopular,
      isBestSeller,
      meetingUrl,
      features,
      resumePreviewImage,
      resumeGuidePdf,
      resumeTemplateLink,
      whatsappGroupLink,
      platform
    } = body

    const service = await prisma.service.create({
      data: {
        title,
        description,
        duration,
        format,
        price: parseFloat(price),
        includes: JSON.stringify(includes || []),
        isActive: isActive !== undefined ? isActive : true,
        category,
        requiredInput,
        salesCount: parseInt(salesCount) || 0,
        showSalesCount,
        autoIncrementSales,
        isPopular,
        isBestSeller,
        meetingUrl,
        features: JSON.stringify(features || []),
        resumePreviewImage,
        resumeGuidePdf,
        resumeTemplateLink,
        whatsappGroupLink,
        platform
      }
    })

    return NextResponse.json({
      ...service,
      includes: JSON.parse(service.includes || '[]'),
      features: JSON.parse(service.features || '[]')
    })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}

