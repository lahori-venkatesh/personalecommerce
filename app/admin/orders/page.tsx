'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface Order {
  id: string
  type: string
  status: string
  paymentStatus: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  slotDateTime?: string
  fulfilled: boolean
  createdAt: string
  service?: { title: string }
  product?: { title: string }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const url = filter !== 'all' ? `/api/orders?status=${filter}` : '/api/orders'
      const res = await fetch(url)
      const data = await res.json()
      setOrders(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const handleMarkFulfilled = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/fulfill`, {
        method: 'PUT'
      })
      if (res.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 size={16} className="text-green-600" />
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />
      case 'cancelled':
      case 'refunded':
        return <XCircle size={16} className="text-red-600" />
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2"
        >
          <option value="all">All Orders</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.service?.title || order.product?.title || 'N/A'}
                    {order.slotDateTime && (
                      <div className="text-xs text-gray-500 mt-1">
                        Slot: {format(new Date(order.slotDateTime), 'MMM dd, yyyy h:mm a')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!order.fulfilled && order.status === 'paid' && (
                      <button
                        onClick={() => handleMarkFulfilled(order.id)}
                        className="text-black hover:text-gray-700"
                      >
                        Mark Fulfilled
                      </button>
                    )}
                    {order.fulfilled && (
                      <span className="text-green-600">Fulfilled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

