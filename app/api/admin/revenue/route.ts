import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalRevenue, orders] = await Promise.all([
      prisma.order.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      }),
      prisma.order.findMany({
        where: { status: 'paid' },
        include: {
          service: true,
          product: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      orders
    })
  } catch (error) {
    console.error('Error fetching revenue:', error)
    return NextResponse.json({ error: 'Failed to fetch revenue' }, { status: 500 })
  }
}

