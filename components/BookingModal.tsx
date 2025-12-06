'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface BookingModalProps {
  type: 'session' | 'notes' | 'priority-dm' | 'custom-service' | 'custom-product'
  entityId?: string
  onClose: () => void
}

export default function BookingModal({ type, entityId, onClose }: BookingModalProps) {
  // Steps: 1 = Service Details, 2 = Slot Selection, 3 = User Details, 4 = Order Summary
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    additionalInfo: '',
    resumeUrl: '',
    linkedinUrl: ''
  })
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)

  const [loading, setLoading] = useState(false)
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const [entityDetails, setEntityDetails] = useState<any>(null)

  // Fetch Entity Details
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
      setFetchingDetails(false)
    }
  }, [type, entityId])

  // Determine if time slot selection is required
  const requiresTimeSlot = (entityDetails?.requiresSlot) || (type === 'session')

  // Fetch Slots when at Step 2 (Slot Selection)
  useEffect(() => {
    if (requiresTimeSlot && step === 2 && entityId) {
      setLoadingSlots(true)
      fetch(`/api/services/${entityId}/slots`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAvailableSlots(data)
          } else {
            setAvailableSlots([])
          }
        })
        .catch(err => console.error('Error fetching slots:', err))
        .finally(() => setLoadingSlots(false))
    }
  }, [requiresTimeSlot, step, entityId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleContinue = () => {
    if (step === 1) {
      // Service Details -> Slot (if required) OR User Details
      if (requiresTimeSlot) {
        setStep(2)
      } else {
        setStep(3)
      }
    } else if (step === 2) {
      // Slot Selection -> User Details
      if (!selectedSlot) {
        alert('Please select a time slot')
        return
      }
      setStep(3)
    } else if (step === 3) {
      // User Details -> Order Summary
      if (!formData.fullName || !formData.email || !formData.whatsapp) {
        alert('Please fill in all required fields')
        return
      }

      // Validate Custom Inputs
      if (entityDetails?.requiredInput === 'Resume' && !formData.resumeUrl) {
        alert('Please provide your Resume URL')
        return
      }
      if (entityDetails?.requiredInput === 'LinkedIn' && !formData.linkedinUrl) {
        alert('Please provide your LinkedIn Profile URL')
        return
      }

      setStep(4)
    } else if (step === 4) {
      // Order Summary -> Payment
      handlePayment()
    }
  }

  const handleBack = () => {
    if (step === 4) {
      setStep(3) // Summary -> User Details
    } else if (step === 3) {
      if (requiresTimeSlot) {
        setStep(2) // User Details -> Slot
      } else {
        setStep(1) // User Details -> Service Details
      }
    } else if (step === 2) {
      setStep(1) // Slot -> Service Details
    } else if (step === 1) {
      onClose() // Close modal
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const orderData = {
        type: type,
        amount: displayPrice,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.whatsapp,
        slotDateTime: selectedSlot?.toISOString(),
        additionalInfo: `${formData.additionalInfo}\n${(formData as any).resumeUrl ? `Resume: ${(formData as any).resumeUrl}` : ''}\n${(formData as any).linkedinUrl ? `LinkedIn: ${(formData as any).linkedinUrl}` : ''}`,
        entityId: entityId
      }

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (data.orderId && data.razorpayOrderId) {
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
          amount: displayPrice * 100,
          currency: 'INR',
          name: 'Venkatesh Lahori',
          description: displayTitle,
          order_id: data.razorpayOrderId,
          handler: async (response: any) => {
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
      displayPrice = 1999
      break
    case 'notes':
      displayTitle = 'Get Notes'
      displayPrice = 499
      break
    case 'priority-dm':
      displayTitle = 'Priority DM'
      displayPrice = 999
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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
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
          ) : (
            <>
              {/* Step 1: Service Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {entityDetails?.description || 'No description available.'}
                    </p>
                  </div>

                  {entityDetails?.includes && entityDetails.includes.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                      <ul className="space-y-2">
                        {entityDetails.includes.map((item: string, index: number) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <span className="mr-2 text-green-500">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {entityDetails?.features && entityDetails.features.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-semibold text-gray-900 mb-3">Key Features:</h3>
                      <ul className="space-y-2">
                        {entityDetails.features.map((item: string, index: number) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <span className="mr-2 text-blue-500">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Total Price</p>
                      <p className="text-3xl font-bold text-gray-900">₹{displayPrice}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Slot Selection */}
              {step === 2 && requiresTimeSlot && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Select a Time Slot
                  </h3>

                  {loadingSlots ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                      <p>No slots available for the selected service.</p>
                      <p className="text-sm mt-1">Please contact us for custom timing.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(new Date(slot.startTime))}
                          className={`p-3 border rounded-md text-left hover:bg-gray-50 ${selectedSlot?.getTime() === new Date(slot.startTime).getTime()
                            ? 'border-black bg-gray-100'
                            : 'border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-500" />
                            <span className="font-medium">{format(new Date(slot.startTime), 'MMM dd, yyyy')}</span>
                          </div>
                          <span className="text-sm text-gray-600">{format(new Date(slot.startTime), 'h:mm a')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: User Details */}
              {step === 3 && (
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

                    {entityDetails?.requiredInput === 'Resume' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resume URL (Google Drive/Dropbox) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          name="resumeUrl"
                          value={(formData as any).resumeUrl || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                          placeholder="https://..."
                          required
                        />
                      </div>
                    )}

                    {entityDetails?.requiredInput === 'LinkedIn' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn Profile URL <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          name="linkedinUrl"
                          value={(formData as any).linkedinUrl || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                          placeholder="https://linkedin.com/in/..."
                          required
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Step 4: Order Summary */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
                        <span className="font-semibold text-gray-600 min-w-[80px]">Service:</span>
                        <span className="font-medium text-gray-900">{displayTitle}</span>
                      </div>

                      {entityDetails?.description && (
                        <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Description:</span>
                          <span className="text-gray-600 leading-relaxed">{entityDetails.description}</span>
                        </div>
                      )}

                      {selectedSlot && (
                        <div className="flex flex-col sm:flex-row sm:gap-2 text-sm">
                          <span className="font-semibold text-gray-600 min-w-[80px]">Slot:</span>
                          <span className="font-medium text-gray-900">
                            {format(selectedSlot, 'MMM dd, yyyy - h:mm a')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-2">
                      <span className="text-gray-900 font-bold">Total Amount</span>
                      <span className="text-xl font-bold text-gray-900">₹{displayPrice}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wide">Customer Details</h3>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-blue-700">Name:</span> <span className="font-medium text-blue-900">{formData.fullName}</span></p>
                      <p><span className="text-blue-700">Email:</span> <span className="font-medium text-blue-900">{formData.email}</span></p>
                      <p><span className="text-blue-700">WhatsApp:</span> <span className="font-medium text-blue-900">{formData.whatsapp}</span></p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-yellow-800">Important Check</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please check your <strong>Email ID</strong> and <strong>WhatsApp Number</strong> carefully.
                        These will be used for your login and to access your order in the "My Orders" section.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-6 flex gap-4 justify-end">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    {step === 4 ? 'Back to Edit' : 'Back'}
                  </button>
                )}

                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className="bg-black text-white py-2 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Processing...' : (
                    step === 4
                      ? `Pay ₹${displayPrice}`
                      : (step === 1 && requiresTimeSlot ? 'Select Slot' : 'Continue')
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
