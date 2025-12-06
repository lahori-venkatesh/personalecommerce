'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Trash2, Plus } from 'lucide-react'

interface Service {
  id: string
  title: string
  requiresSlot: boolean
}

interface Slot {
  id: string
  startTime: string
  isBooked: boolean
  service: {
    title: string
  }
}

export default function SlotManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'))
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [addingSlot, setAddingSlot] = useState(false)

  // Time selection for new slot
  const [selectedTime, setSelectedTime] = useState('09:00')

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (selectedService) {
      fetchSlots()
    }
  }, [selectedService, selectedDate])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()

      if (Array.isArray(data)) {
        // Filter out services that don't require slots
        const slotServices = data.filter((service: any) => {
          const title = service.title.toLowerCase()
          const category = service.category?.toLowerCase() || ''

          // Exclude specific non-slot services
          if (category.includes('resume template')) return false
          if (title.includes('priority dm')) return false
          if (title.includes('whatsapp')) return false
          if (title.includes('community')) return false
          if (title.includes('notes')) return false
          if (category.includes('product')) return false

          // Show everything else by default
          // This ensures all "session", "interview", "review" type services are visible
          return true
        })
        setServices(slotServices)
      } else {
        setServices([])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    }
  }

  const fetchSlots = async () => {
    setLoading(true)
    try {
      // Fetch slots for the selected service and date range (entire day)
      const start = new Date(selectedDate)
      const end = new Date(selectedDate)
      end.setHours(23, 59, 59, 999)

      const res = await fetch(`/api/admin/slots?serviceId=${selectedService}&startDate=${start.toISOString()}&endDate=${end.toISOString()}`)
      const data = await res.json()
      setSlots(data)
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSlot = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return

    setAddingSlot(true)
    try {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`)

      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          startTime: dateTime.toISOString()
        })
      })

      if (res.ok) {
        fetchSlots()
        // Optional: Show success message
      } else {
        alert('Failed to add slot')
      }
    } catch (error) {
      console.error('Error adding slot:', error)
    } finally {
      setAddingSlot(false)
    }
  }

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slot?')) return

    try {
      const res = await fetch(`/api/admin/slots?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setSlots(slots.filter(slot => slot.id !== id))
      } else {
        alert('Failed to delete slot')
      }
    } catch (error) {
      console.error('Error deleting slot:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Slot Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Service Selection */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
          >
            <option value="">-- Choose a Service --</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.title} {service.requiresSlot ? '(Requires Slot)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
          />
        </div>

        {/* Add Slot Action */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Add New Slot</label>
          <div className="flex gap-2">
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
            />
            <button
              onClick={handleAddSlot}
              disabled={!selectedService || addingSlot}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Slots List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">
            Available Slots for {selectedDate ? format(new Date(selectedDate), 'MMMM dd, yyyy') : '...'}
          </h2>
          <span className="text-sm text-gray-500">{slots.length} slots found</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading slots...</div>
        ) : slots.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No slots added for this date. Select a service and add slots above.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {slots.map((slot) => (
              <div key={slot.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${slot.isBooked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {format(new Date(slot.startTime), 'h:mm a')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {slot.isBooked ? 'Booked' : 'Available'}
                    </p>
                  </div>
                </div>

                {!slot.isBooked && (
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Slot"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
