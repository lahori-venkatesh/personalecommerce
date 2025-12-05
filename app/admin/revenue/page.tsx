'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { Download } from 'lucide-react'
import { format } from 'date-fns'

interface RevenueData {
  totalRevenue: number
  orders: Array<{
    id: string
    amount: number
    createdAt: string
    customerName: string
    service?: { title: string }
    product?: { title: string }
  }>
}

export default function AdminRevenue() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRevenue()
  }, [])

  const fetchRevenue = async () => {
    try {
      const res = await fetch('/api/admin/revenue')
      const data = await res.json()
      setData(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching revenue:', error)
      setLoading(false)
    }
  }

  const exportCSV = () => {
    if (!data) return

    const csv = [
      ['Order ID', 'Date', 'Customer', 'Item', 'Amount'].join(','),
      ...data.orders.map(order => [
        order.id.substring(0, 8),
        format(new Date(order.createdAt), 'yyyy-MM-dd'),
        order.customerName,
        order.service?.title || order.product?.title || 'N/A',
        order.amount
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `revenue-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Revenue Reports</h1>
          {data && (
            <button
              onClick={exportCSV}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center gap-2"
            >
              <Download size={20} />
              Export CSV
            </button>
          )}
        </div>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : data && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="text-3xl font-bold text-gray-900">
                ₹{data.totalRevenue.toLocaleString()}
              </div>
              <p className="text-gray-600 mt-2">Total Revenue</p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Transaction History</h2>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.service?.title || order.product?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ₹{order.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

