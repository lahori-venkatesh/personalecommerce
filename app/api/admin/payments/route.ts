import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payments = await prisma.order.findMany({
      select: {
        id: true,
        razorpayOrderId: true,
        razorpayPaymentId: true,
        paymentStatus: true,
        amount: true,
        customerName: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}

