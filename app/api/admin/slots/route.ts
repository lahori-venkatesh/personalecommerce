import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get('serviceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (serviceId) {
      where.serviceId = serviceId
    }

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const slots = await prisma.slot.findMany({
      where,
      include: {
        service: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Error fetching slots:', error)
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { serviceId, startTime } = body

    if (!serviceId || !startTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slot = await prisma.slot.create({
      data: {
        serviceId,
        startTime: new Date(startTime),
        isBooked: false
      }
    })

    return NextResponse.json(slot)
  } catch (error) {
    console.error('Error creating slot:', error)
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing slot ID' }, { status: 400 })
    }

    await prisma.slot.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting slot:', error)
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 })
  }
}
