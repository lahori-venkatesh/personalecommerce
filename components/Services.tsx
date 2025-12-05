'use client'

import { useState, useEffect } from 'react'
import BookingModal from './BookingModal'
import ImagePreviewModal from './ImagePreviewModal'
import { Clock, CheckCircle2, TrendingUp, Award, Users, ArrowRight, Eye } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  duration?: string
  format?: string
  price: number
  includes: string[]
  category: string
  requiredInput: string
  salesCount: number
  showSalesCount: boolean
  isPopular: boolean
  isBestSeller: boolean
  features: string[]
  resumePreviewImage?: string
  resumeGuidePdf?: string
  resumeTemplateLink?: string
  platform?: string
}

const ServiceCard = ({ service, onBook, index, onPreview }: { service: Service; onBook: (s: Service) => void; index: number; onPreview: (url: string, title: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const allIncludes = [...(service.includes || []), ...(service.features || [])]
  const visibleIncludes = isExpanded ? allIncludes : allIncludes.slice(0, 3)
  const hasMore = allIncludes.length > 3

  if (service.category === 'Resume Templates') {
    return (
      <div
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-[540px] mt-4"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="h-[80%] bg-gray-100 overflow-hidden relative flex-shrink-0 group-hover:shadow-inner">
          {service.resumePreviewImage ? (
            <img
              src={service.resumePreviewImage}
              alt={service.title}
              className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={() => onPreview(service.resumePreviewImage!, service.title)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 font-medium">No Preview</span>
            </div>
          )}

          {/* Gradient Overlay for Text */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />

          {/* Title and Description Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
            <h3 className="text-xl font-bold leading-tight mb-1 shadow-sm">
              {service.title}
            </h3>
            <p className="text-gray-200 text-sm line-clamp-1 shadow-sm opacity-90">
              {service.description}
            </p>
          </div>

          {/* Platform Badge - Top Right */}
          {service.platform && (
            <div className="absolute top-4 right-4 z-30">
              <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary-600 backdrop-blur-md text-white shadow-lg border border-white/20 flex items-center gap-1.5">
                {service.platform} Template
              </div>
            </div>
          )}

          {/* Preview Overlay Button */}
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-20"
            onClick={() => service.resumePreviewImage && onPreview(service.resumePreviewImage, service.title)}
          >
            <button className="text-white font-medium px-6 py-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/30 transition-all transform hover:scale-105 flex items-center gap-2">
              <Eye size={18} />
              Preview Full Resume
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col h-[25%] justify-center bg-white relative z-20 border-t border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <span className="text-2xl font-bold text-gray-900">
              ₹{service.price}
            </span>
            <button
              onClick={() => onBook(service)}
              className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-gray-200 hover:shadow-primary-500/30 text-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`glass rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary-200 group relative border border-gray-300 mt-4  ${isExpanded ? 'h-auto' : 'h-[540px]'}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
        {service.isBestSeller ? (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Award size={10} /> Best Seller
          </span>
        ) : service.isPopular ? (
          <span className="bg-yellow-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
            <TrendingUp size={10} /> Popular
          </span>
        ) : null}
      </div>

      <div className="mb-4 mt-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors pr-16">
          {service.title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm line-clamp-2 h-10 overflow-hidden">
          {service.description}
        </p>
      </div>

      <div className="space-y-2 mb-4 flex-grow">
        {service.showSalesCount && service.salesCount > 0 && (
          <div className="flex items-center text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full mb-2">
            <Users size={12} className="mr-1.5" />
            {service.salesCount}+ people booked this
          </div>
        )}

        {service.duration && (
          <div className="flex items-center text-xs text-gray-500 bg-gray-50 w-fit px-2 py-1 rounded-full">
            <Clock size={12} className="mr-1.5 text-primary-500" />
            {service.duration}
          </div>
        )}

        {service.format && (
          <div className="text-xs text-gray-500 px-1">
            Format: <span className="font-medium text-gray-700">{service.format}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <ul className="space-y-2">
          {visibleIncludes.map((item, i) => (
            <li key={i} className="flex items-start text-sm text-gray-600">
              <CheckCircle2 size={16} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
        {hasMore && !isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(true)
            }}
            className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View more details <ArrowRight size={14} />
          </button>
        )}
        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(false)
            }}
            className="mt-3 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
          >
            Show less
          </button>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₹{service.price}
          </span>
        </div>
        <button
          onClick={() => onBook(service)}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-gray-200 hover:shadow-primary-500/30"
        >
          Book Now
        </button>
      </div>
    </div>
  )
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ url: string, title: string } | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data)
        } else {
          console.error('Services data is not an array:', data)
          setServices([])
        }
      })
      .catch(err => console.error('Error fetching services:', err))
  }, [])

  const handleBookNow = (service: Service) => {
    setSelectedService(service)
    setShowModal(true)
  }

  const handlePreview = (url: string, title: string) => {
    setPreviewImage({ url, title })
  }

  return (
    <>
      <section id="services" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-150 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the service that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBookNow}
                index={index}
                onPreview={handlePreview}
              />
            ))}
          </div>
        </div>
      </section>

      {showModal && selectedService && (
        <BookingModal
          type="custom-service"
          entityId={selectedService.id}
          onClose={() => {
            setShowModal(false)
            setSelectedService(null)
          }}
        />
      )}

      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage.url}
          altText={previewImage.title}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  )
}

