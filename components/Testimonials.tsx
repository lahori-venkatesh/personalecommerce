'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  quote: string
  rating: number
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error('Error fetching testimonials:', err))
  }, [])

  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      role: 'Software Engineer at Google',
      quote: 'The mock interviews were incredibly helpful. The feedback was detailed and actionable. Landed my dream job!',
      rating: 5
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'Frontend Developer at Amazon',
      quote: 'The mentorship sessions helped me navigate my career transition. Highly recommend!',
      rating: 5
    },
    {
      id: '3',
      name: 'Amit Patel',
      role: 'Backend Engineer at Microsoft',
      quote: 'The DSA notes were comprehensive and well-structured. Great value for money!',
      rating: 5
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      role: 'Full Stack Developer at Meta',
      quote: 'System design preparation was excellent. Covered all the important concepts.',
      rating: 5
    }
  ]

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length)
  }

  return (
    <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from students who have transformed their careers
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {displayTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-full px-4"
                >
                  <div className="glass p-10 md:p-14 rounded-2xl text-center relative">
                    <div className="absolute top-6 left-8 text-6xl text-primary-200 font-serif leading-none opacity-50">"</div>

                    <div className="flex justify-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={24}
                          className="text-yellow-400 fill-current"
                        />
                      ))}
                    </div>

                    <p className="text-xl md:text-2xl text-gray-700 mb-8 font-medium leading-relaxed relative z-10">
                      {testimonial.quote}
                    </p>

                    <div>
                      <p className="font-bold text-gray-900 text-lg mb-1">
                        {testimonial.name}
                      </p>
                      <p className="text-primary-600 font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-primary-50 hover:text-primary-600 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white text-gray-800 rounded-full p-3 shadow-lg hover:bg-primary-50 hover:text-primary-600 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex justify-center mt-10 gap-3">
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-primary-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

