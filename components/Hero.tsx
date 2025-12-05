'use client'

import { useState } from 'react'
import BookingModal from './BookingModal'
import { Calendar, BookOpen, ArrowRight, Star, Users, Briefcase } from 'lucide-react'

interface HeroSettings {
  title: string
  subtitle: string
  theme: string
  button1Text: string
  button1Link: string
  button1Show: boolean
  button2Text: string
  button2Link: string
  button2Show: boolean
  stats: any
}

export default function Hero({ settings }: { settings?: HeroSettings | null }) {
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingType, setBookingType] = useState<'session' | 'notes' | 'priority-dm' | 'custom-service' | 'custom-product'>('session')
  const [entityId, setEntityId] = useState<string>('')

  const handleAction = (action: string) => {
    if (action.startsWith('service:')) {
      setBookingType('custom-service')
      setEntityId(action.split(':')[1])
      setShowBookingModal(true)
    } else if (action.startsWith('product:')) {
      setBookingType('custom-product')
      setEntityId(action.split(':')[1])
      setShowBookingModal(true)
    } else if (action === 'session') {
      setBookingType('session')
      setShowBookingModal(true)
    } else if (action === 'priority-dm') {
      setBookingType('priority-dm')
      setShowBookingModal(true)
    } else if (action === 'notes') {
      // Scroll to notes section
      const notesSection = document.getElementById('notes')
      if (notesSection) {
        notesSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  // Default values if no settings provided
  const title = settings?.title || "Master Your Technical Interviews"
  const subtitle = settings?.subtitle || "Unlock your potential with personalized coaching, expert mentorship, and curated resources designed for your success."
  const theme = settings?.theme || "Modern"
  const stats = typeof settings?.stats === 'string' ? JSON.parse(settings.stats) : (settings?.stats || [
    { label: 'Students Mentored', value: '500+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'Companies Cracked', value: '50+' },
    { label: 'Rating', value: '4.9/5' },
  ])

  const renderButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200 w-full sm:w-auto px-4 sm:px-0">
      {(settings?.button1Show ?? true) && (
        <button
          onClick={() => handleAction(settings?.button1Link || 'session')}
          className={`group px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center gap-2 ${theme === 'Minimal'
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50'
            }`}
        >
          <Calendar size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          {settings?.button1Text || "Book a Session"}
        </button>
      )}
      {(settings?.button2Show ?? true) && (
        <button
          onClick={() => handleAction(settings?.button2Link || 'priority-dm')}
          className={`group px-8 py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center gap-2 ${theme === 'Bold'
            ? 'bg-white text-black border-2 border-black hover:bg-gray-50'
            : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md'
            }`}
        >
          <BookOpen size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          {settings?.button2Text || "Priority DM"}
        </button>
      )}
    </div>
  )

  if (theme === 'Minimal') {
    return (
      <>
        <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-block mb-6 animate-fade-in">
                <span className="text-sm font-medium tracking-wider uppercase text-gray-500">
                  Elevate your tech career
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight animate-slide-up leading-tight">
                {title}
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl leading-relaxed animate-slide-up delay-100">
                {subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-200">
                {renderButtons()}
              </div>

              <div className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 border-t border-gray-100 pt-8 sm:pt-10">
                {stats.map((stat: any) => (
                  <div key={stat.label}>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {showBookingModal && (
          <BookingModal
            type={bookingType}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </>
    )
  }

  if (theme === 'Bold') {
    return (
      <>
        <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 overflow-hidden bg-gray-50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium mb-8 animate-fade-in">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span>Premium Tech Coaching</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tighter animate-slide-up uppercase">
              {title}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto font-medium animate-slide-up delay-100">
              {subtitle}
            </p>

            {renderButtons()}

            <div className="mt-12 sm:mt-20 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16">
              {stats.map((stat: any) => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 min-w-[160px]">
                  <div className="text-3xl font-black text-black mb-1">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-400 uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {showBookingModal && (
          <BookingModal
            type={bookingType}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </>
    )
  }

  // Modern Theme (Default)
  return (
    <>
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 animate-fade-in">
              <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium border border-primary-100">
                🚀 Elevate your tech career
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight animate-slide-up">
              {title}
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
              {subtitle}
            </p>

            {renderButtons()}

            {/* Social Proof / Stats */}
            <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 animate-fade-in delay-300">
              {stats.map((stat: any) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {showBookingModal && (
        <BookingModal
          type={bookingType}
          entityId={entityId}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  )
}

