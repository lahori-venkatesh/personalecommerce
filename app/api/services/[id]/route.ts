import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        title,
        description,
        duration,
        format,
        price,
        includes: JSON.stringify(includes),
        isActive,
        category,
        requiredInput,
        salesCount,
        showSalesCount,
        autoIncrementSales,
        isPopular,
        isBestSeller,
        meetingUrl,
        features: JSON.stringify(features),
        resumePreviewImage,
        resumeGuidePdf,
        resumeTemplateLink,
        whatsappGroupLink,
        platform
      }
    })

    return NextResponse.json({
      ...service,
      includes: JSON.parse(service.includes || '[]')
    })
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}

