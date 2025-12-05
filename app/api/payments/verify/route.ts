import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendEmail } from '@/lib/mail'
import { emailTemplates } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = body

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(text)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: 'paid',
        status: 'paid',
        fulfilled: false
      },
      include: {
        service: true,
        product: true
      }
    })

    // If product, increment sold count
    if (order.productId) {
      await prisma.product.update({
        where: { id: order.productId },
        data: {
          soldCount: { increment: 1 }
        }
      })
    }

    // Send confirmation email
    try {
      await sendEmail({
        to: order.customerEmail,
        subject: 'Order Confirmation - Venkatesh Lahori',
        html: emailTemplates.orderConfirmation(order),
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}

