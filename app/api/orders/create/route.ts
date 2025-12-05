import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'
import { z } from 'zod'
import rateLimit from '@/lib/rate-limit'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
})

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

const orderSchema = z.object({
  type: z.string(),
  serviceId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  entityId: z.string().optional().nullable(),
  amount: z.number().or(z.string().transform((val: string) => parseFloat(val))),
  customerName: z.string().min(1, 'Name is required'),
  customerEmail: z.string().email('Invalid email'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  slotDateTime: z.string().optional().nullable(),
  additionalInfo: z.string().optional().nullable()
})

export async function POST(request: Request) {
  try {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    try {
      await limiter.check(NextResponse.next(), 10, ip) // 10 requests per minute per IP
    } catch {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()

    // Input Validation
    const result = orderSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 })
    }

    const {
      type,
      serviceId,
      productId,
      entityId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      slotDateTime,
      additionalInfo
    } = result.data

    // Find or create user
    let user = null
    if (customerEmail) {
      user = await prisma.user.upsert({
        where: { email: customerEmail },
        update: { name: customerName, phone: customerPhone },
        create: {
          email: customerEmail,
          phone: customerPhone,
          name: customerName
        }
      })
    } else if (customerPhone) {
      user = await prisma.user.upsert({
        where: { phone: customerPhone },
        update: { name: customerName },
        create: {
          phone: customerPhone,
          name: customerName
        }
      })
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: user?.id,
        serviceId: (type === 'service' || type === 'custom-service') ? (serviceId || entityId) : null,
        productId: (type === 'product' || type === 'custom-product') ? (productId || entityId) : null,
        type,
        amount: amount,
        customerName,
        customerEmail,
        customerPhone,
        slotDateTime: slotDateTime ? new Date(slotDateTime) : null
      }
    })

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${order.id}`,
      notes: {
        orderId: order.id,
        type,
        customerName,
        customerEmail,
        customerPhone
      }
    })

    // Update order with Razorpay order ID
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id }
    })

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: Number(razorpayOrder.amount) / 100
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

