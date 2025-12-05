import React from 'react'

export const metadata = {
  title: 'Shipping Policy | Venkatesh Lahori',
  description: 'Shipping Policy for Venkatesh Lahori Coaching & Mentorship',
}

export default function ShippingPolicy() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Shipping Policy</h1>
      <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Digital Delivery</h2>
      <p>
        All products and services offered on this website are digital in nature. No physical products will be shipped.
      </p>

      <h2>2. Delivery Timeline</h2>
      <ul>
        <li><strong>1:1 Sessions:</strong> You will receive a confirmation email with the meeting link immediately after booking.</li>
        <li><strong>Digital Products:</strong> Download links will be available immediately after successful payment and will also be sent to your registered email address.</li>
        <li><strong>WhatsApp Community:</strong> The invite link will be provided immediately after purchase.</li>
      </ul>

      <h2>3. Issues with Delivery</h2>
      <p>
        If you do not receive your digital product link or meeting confirmation within 1 hour of purchase, please check your spam folder. If it is not there, please contact us immediately at <a href="mailto:lahorivenkatesh709@gmail.com">lahorivenkatesh709@gmail.com</a> with your order details.
      </p>
    </div>
  )
}
