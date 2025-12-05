'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar, Download, Video, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  type: string
  status: string
  paymentStatus: string
  amount: number
  slotDateTime?: string
  fulfilled: boolean
  createdAt: string
  service?: { title: string; whatsappGroupLink?: string }
  product?: { title: string; fileUrl?: string }
}

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email && !phone) {
      alert('Please enter email or phone number')
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (email) params.append('email', email)
      if (phone) params.append('phone', phone)

      const res = await fetch(`/api/orders?${params.toString()}`)
      const data = await res.json()
      setOrders(data)
      setSearched(true)
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Login to View Orders</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OR Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="+91 1234567890"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'View Orders'}
            </button>
          </form>
        </div>

        {searched && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Order History</h2>
            </div>
            {orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No orders found. Please check your email or phone number.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.service?.title || order.product?.title || 'Order'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Order ID: {order.id.substring(0, 8)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.amount}</p>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {order.slotDateTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar size={16} />
                        <span>
                          Scheduled: {format(new Date(order.slotDateTime), 'MMM dd, yyyy h:mm a')}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-500">
                        Ordered on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </p>
                      <div className="flex gap-2">
                        {order.type === 'service' && order.slotDateTime && (
                          <a
                            href="#"
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                          >
                            <Video size={16} />
                            Join Session
                          </a>
                        )}
                        {order.type === 'service' && order.service?.whatsappGroupLink && (
                          <a
                            href={order.service.whatsappGroupLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                          >
                            <Video size={16} />
                            Join WhatsApp Group
                          </a>
                        )}
                        <a
                          href={`/invoices/${order.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
                        >
                          Download Invoice
                        </a>
                        {order.type === 'product' && order.product?.fileUrl && (
                          <a
                            href={order.product.fileUrl}
                            download
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
                          >
                            <Download size={16} />
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

