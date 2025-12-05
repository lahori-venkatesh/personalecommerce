import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Venkatesh Lahori - Technical Interview Coaching & Mentorship',
    template: '%s | Venkatesh Lahori'
  },
  description: 'Technical interview coaching, 1-on-1 mentorship, and curated notes for job seekers. Master DSA, System Design, and Behavioral interviews.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://venkateshlahori.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Venkatesh Lahori',
    title: 'Venkatesh Lahori - Technical Interview Coaching',
    description: 'Master your technical interviews with personalized coaching and curated resources.',
    images: [
      {
        url: '/og-image.jpg', // Ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'Venkatesh Lahori Coaching'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Venkatesh Lahori - Technical Interview Coaching',
    description: 'Master your technical interviews with personalized coaching and curated resources.',
    creator: '@venkateshlahori' // Replace with actual handle if known
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import WhatsAppButton from '@/components/WhatsAppButton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}

