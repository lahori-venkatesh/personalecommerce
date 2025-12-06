import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get slots for the next 30 days
    const today = new Date()
    const thirtyDaysLater = new Date()
    thirtyDaysLater.setDate(today.getDate() + 30)

    const slots = await prisma.slot.findMany({
      where: {
        serviceId: id,
        isBooked: false,
        startTime: {
          gte: today,
          lte: thirtyDaysLater
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Error fetching service slots:', error)
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 })
  }
}
