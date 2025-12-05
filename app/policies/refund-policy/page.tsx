import React from 'react'

export const metadata = {
  title: 'Refund Policy | Venkatesh Lahori',
  description: 'Refund Policy for Venkatesh Lahori Coaching & Mentorship',
}

export default function RefundPolicy() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Refund Policy</h1>
      <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Services (Coaching & Mentorship)</h2>
      <p>
        Due to the nature of the services provided (time and expertise), we generally do not offer refunds for completed coaching sessions or mentorship programs.
      </p>
      <p>
        However, if you are unsatisfied with a session, please contact us within 24 hours of the session completion, and we will do our best to address your concerns, which may include a complimentary follow-up session or a partial refund at our discretion.
      </p>

      <h2>2. Digital Products</h2>
      <p>
        All sales of digital products (e.g., notes, guides, templates) are final. Since these products are downloadable and cannot be returned, we do not offer refunds once the purchase is complete and the download link has been provided.
      </p>

      <h2>3. Cancellations</h2>
      <p>
        If you need to cancel or reschedule a booked session, please do so at least 24 hours in advance. Cancellations made less than 24 hours before the scheduled time may not be eligible for a refund or rescheduling.
      </p>

      <h2>4. Contact Us</h2>
      <p>
        If you have any questions concerning our return policy, please contact us at: <a href="mailto:lahorivenkatesh709@gmail.com">lahorivenkatesh709@gmail.com</a>
      </p>
    </div>
  )
}
