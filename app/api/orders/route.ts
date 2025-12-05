import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')
    const status = searchParams.get('status')

    let where: any = {}

    if (email || phone) {
      where.OR = []
      if (email) {
        where.OR.push({ customerEmail: email })
      }
      if (phone) {
        where.OR.push({ customerPhone: phone })
      }
    }

    if (status) {
      where.status = status
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        service: true,
        product: true,
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

