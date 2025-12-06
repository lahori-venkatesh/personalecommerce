import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('admin_token', '', { maxAge: 0, path: '/' })
  cookieStore.delete('admin_token')

  return NextResponse.json({ success: true })
}
