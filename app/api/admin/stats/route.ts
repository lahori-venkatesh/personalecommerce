import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalRevenue, totalOrders, totalUsers, pendingOrders] = await Promise.all([
      prisma.order.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.count({
        where: { status: 'pending' }
      })
    ])

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.amount || 0,
      totalOrders,
      totalUsers,
      pendingOrders
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

