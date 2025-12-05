'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock } from 'lucide-react'
import { format, addDays, addHours, setHours, setMinutes } from 'date-fns'

// Removed Service interface


// Removed Product interface


interface BookingModalProps {
  type: 'session' | 'notes' | 'priority-dm' | 'custom-service' | 'custom-product'
  entityId?: string
  onClose: () => void
}

export default function BookingModal({ type, entityId, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    additionalInfo: ''
  })
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)


  const [loading, setLoading] = useState(false)
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const [entityDetails, setEntityDetails] = useState<any>(null)

  useEffect(() => {
    if ((type === 'custom-service' || type === 'custom-product') && entityId) {
      setFetchingDetails(true)
      const endpoint = type === 'custom-service' ? `/api/services/${entityId}` : `/api/products/${entityId}`

      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          setEntityDetails(data)
          setFetchingDetails(false)
        })
        .catch(err => {
          console.error('Error fetching entity details:', err)
          setFetchingDetails(false)
        })
    } else {
      setEntityDetails(null)
    }
  }, [type, entityId])

  // Generate available time slots (next 7 days, 9 AM to 6 PM, hourly)
  const generateTimeSlots = () => {
    const slots: Date[] = []
    const today = new Date()

    for (let day = 0; day < 7; day++) {
      const date = addDays(today, day)
      for (let hour = 9; hour < 18; hour++) {
        const slot = setMinutes(setHours(date, hour), 0)
        if (slot > new Date()) {
          slots.push(slot)
        }
      }
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleContinue = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.whatsapp) {
        alert('Please fill in all required fields')
        return
      }
      if (type === 'session' || type === 'priority-dm' || type === 'custom-service') { // Services require slot selection
        setStep(2)
      } else {
        handlePayment() // Direct to payment for notes/products
      }
    } else if (step === 2) {
      if (!selectedSlot) {
        alert('Please select a time slot')
        return
      }
      handlePayment()
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const orderData = {
        type: type, // Use the new type directly
        amount: displayPrice, // Use the calculated displayPrice
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.whatsapp,
        slotDateTime: selectedSlot?.toISOString(),
        additionalInfo: formData.additionalInfo,
        entityId: entityId // Pass entityId to API
      }

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.orderId && data.razorpayOrderId) {
        // Load Razorpay script if not already loaded
        const loadRazorpayScript = () => {
          return new Promise((resolve) => {
            if ((window as any).Razorpay) {
              resolve(true)
              return
            }
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.onload = () => resolve(true)
            script.onerror = () => {
              alert('Failed to load payment gateway. Please refresh and try again.')
              setLoading(false)
            }
            document.body.appendChild(script)
          })
        }

        await loadRazorpayScript()

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: displayPrice * 100, // Amount in paise
          currency: 'INR',
          name: 'Venkatesh Lahori',
          description: displayTitle,
          order_id: data.razorpayOrderId,
          handler: async (response: any) => {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId
              })
            })

            const verifyData = await verifyResponse.json()
            if (verifyData.success) {
              alert('Payment successful! You will receive a confirmation email and WhatsApp message.')
              onClose()
              window.location.reload()
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.whatsapp
          },
          theme: {
            color: '#000000'
          }
        }

        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
        razorpay.on('payment.failed', () => {
          alert('Payment failed. Please try again.')
          setLoading(false)
        })
      } else {
        alert('Failed to create order. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  let displayTitle: string
  let displayPrice: number

  switch (type) {
    case 'session':
      displayTitle = '1:1 Session'
      displayPrice = 1999 // Example price for session
      break
    case 'notes':
      displayTitle = 'Get Notes'
      displayPrice = 499 // Example price for notes
      break
    case 'priority-dm':
      displayTitle = 'Priority DM'
      displayPrice = 999 // Example price for priority-dm
      break
    case 'custom-service':
      displayTitle = entityDetails?.title || 'Service Booking'
      displayPrice = entityDetails?.price || 0
      break
    case 'custom-product':
      displayTitle = entityDetails?.title || 'Product Purchase'
      displayPrice = entityDetails?.price || 0
      break
    default:
      displayTitle = 'Booking'
      displayPrice = 0
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{displayTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {fetchingDetails ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : step === 1 ? (
            <>
              <div className="mb-6">
                <p className="text-lg text-gray-700 mb-2">
                  {displayTitle}
                </p>
                <p className="text-2xl font-bold text-black">
                  ₹{displayPrice}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    placeholder="Any specific requirements or questions..."
                  />
                </div>
              </div>
              {/* Required Input Fields - Moved here */}
              {/* Removed dynamic required input logic for now as it depended on service prop */}
            </>
          ) : null}

          {!fetchingDetails && step === 2 && (type === 'session' || type === 'priority-dm' || type === 'custom-service') && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} />
                Select a Time Slot
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 border rounded-md text-left hover:bg-gray-50 ${selectedSlot?.getTime() === slot.getTime()
                      ? 'border-black bg-gray-100'
                      : 'border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span className="font-medium">{format(slot, 'MMM dd, yyyy')}</span>
                    </div>
                    <span className="text-sm text-gray-600">{format(slot, 'h:mm a')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Removed product preview logic */}

          <div className="mt-6 flex gap-4 justify-end">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Back
              </button>
            )}

            <button
              onClick={handleContinue}
              disabled={loading}
              className="bg-black text-white py-2 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Processing...' : (
                (type === 'session' || type === 'priority-dm' || type === 'custom-service') && step === 1
                  ? 'Continue'
                  : `Pay ₹${displayPrice}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

