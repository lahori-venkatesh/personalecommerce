import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import { prisma } from '@/lib/prisma'

async function getHeroSettings() {
  try {
    const settings = await prisma.heroSettings.findFirst()
    return settings
  } catch (error) {
    console.warn('Error fetching hero settings (using defaults):', error)
    return null
  }
}

import Products from '@/components/Products'
import Footer from '@/components/Footer'

export default async function Home() {
  const heroSettings = await getHeroSettings()

  return (
    <main className="min-h-screen">
      <Header />
      <Hero settings={heroSettings} />
      <Services />
      <Products />
      <section id="support" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto border border-gray-100 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Need Help?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Have questions or need support? We're here to help you succeed in your interview preparation journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'lahorivenkatesh709@gmail.com'}`}
                className="bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-gray-200 hover:shadow-primary-500/30"
              >
                Email Support
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_CONTACT_PHONE || '919182928956'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 hover:shadow-green-500/30"
              >
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

