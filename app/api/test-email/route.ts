import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail'
import { getOrderConfirmationEmail } from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const html = getOrderConfirmationEmail(
      'Test User',
      'TEST-123456',
      999,
      'Test Service Booking'
    )

    const result = await sendEmail({
      to: email,
      subject: 'Test Email from Venkatesh Lahori',
      html
    })

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to send email', details: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
