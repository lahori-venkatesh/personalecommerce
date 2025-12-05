import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature') || ''

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    const { event: eventType, payload } = event

    if (eventType === 'payment.captured') {
      const { order_id, id: payment_id } = payload.payment.entity

      // Find order by Razorpay order ID
      const order = await prisma.order.findFirst({
        where: { razorpayOrderId: order_id }
      })

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            razorpayPaymentId: payment_id,
            paymentStatus: 'paid',
            status: 'paid'
          }
        })

        // Increment sold count for products
        if (order.productId) {
          await prisma.product.update({
            where: { id: order.productId },
            data: {
              soldCount: { increment: 1 }
            }
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

