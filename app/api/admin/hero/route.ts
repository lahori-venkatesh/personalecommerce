import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const settings = await prisma.heroSettings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching hero settings:', error)
    return NextResponse.json({ error: 'Error fetching settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    let settings
    if (id) {
      settings = await prisma.heroSettings.update({
        where: { id },
        data
      })
    } else {
      settings = await prisma.heroSettings.create({
        data
      })
    }

    revalidatePath('/')
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error saving hero settings:', error)
    return NextResponse.json({ error: 'Error saving settings' }, { status: 500 })
  }
}
