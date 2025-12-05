import React from 'react'

export const metadata = {
  title: 'Contact Us | Venkatesh Lahori',
  description: 'Contact Venkatesh Lahori for support and inquiries',
}

export default function ContactUs() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Contact Us</h1>
      <p className="text-gray-600 mb-8">We're here to help you!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">For general inquiries, support, and feedback.</p>
          <a href="mailto:lahorivenkatesh709@gmail.com" className="text-primary-600 font-medium hover:text-primary-700">
            lahorivenkatesh709@gmail.com
          </a>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
          <p className="text-gray-600 mb-4">For quick questions and community support.</p>
          <a href="https://wa.me/919182928956" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:text-green-700">
            +91 91829 28956
          </a>
        </div>
      </div>

      <div className="mt-12">
        <h2>Operating Address</h2>
        <p>
          Venkatesh Lahori<br />
          Hyderabad, Telangana, India
        </p>
      </div>
    </div>
  )
}
