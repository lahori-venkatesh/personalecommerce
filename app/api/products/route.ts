import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, detailedDescription, excerpt, price, rating, soldCount, fileUrl, previewUrl, image, category, isPopular, isBestSeller, isActive } = body

    const product = await prisma.product.create({
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
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

