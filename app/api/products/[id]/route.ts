import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, detailedDescription, excerpt, price, rating, soldCount, fileUrl, previewUrl, image, category, isPopular, isBestSeller, isActive } = body

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        title,
        description,
        detailedDescription,
        excerpt,
        price: parseFloat(price),
        rating: rating ? parseFloat(rating) : 0,
        soldCount: soldCount || 0,
        fileUrl,
        previewUrl,
        image,
        category: category || 'Other',
        isPopular: isPopular || false,
        isBestSeller: isBestSeller || false,
        isActive
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

