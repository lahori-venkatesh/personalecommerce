import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

export default async function InvoicePage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      service: true,
      product: true
    }
  })

  if (!order) {
    notFound()
  }

  const itemName = order.service?.title || order.product?.title ||
    (order.type === 'session' ? '1:1 Session' :
      order.type === 'priority-dm' ? 'Priority DM' : 'Custom Service')

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg print:shadow-none">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b pb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-500 mt-1">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">Venkatesh Lahori</h2>
            <p className="text-gray-500 text-sm mt-1">
              Technical Interview Coaching<br />
              Hyderabad, Telangana<br />
              India
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
            <p className="text-gray-900 font-medium">{order.customerName}</p>
            <p className="text-gray-600 text-sm">{order.customerEmail}</p>
            <p className="text-gray-600 text-sm">{order.customerPhone}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Details</h3>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Date:</span> {format(new Date(order.createdAt), 'PPP')}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Payment ID:</span> {order.razorpayPaymentId || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Status:</span> <span className="uppercase">{order.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Item</th>
              <th className="text-right py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-4 text-gray-900">{itemName}</td>
              <td className="py-4 text-right text-gray-900">₹{order.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600">₹{order.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm border-t pt-8">
          <p>Thank you for your business!</p>
          <p className="mt-2">For any questions, please contact lahorivenkatesh709@gmail.com</p>
        </div>

        {/* Print Button (Hidden in Print) */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick="window.print()"
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  )
}
