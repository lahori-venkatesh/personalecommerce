import React from 'react'

export const metadata = {
  title: 'Terms and Conditions | Venkatesh Lahori',
  description: 'Terms and Conditions for Venkatesh Lahori Coaching & Mentorship',
}

export default function TermsAndConditions() {
  return (
    <div className="prose prose-blue max-w-none">
      <h1>Terms and Conditions</h1>
      <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <h2>1. Agreement to Terms</h2>
      <p>
        These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Venkatesh Lahori ("we," "us" or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
      </p>

      <h2>2. Intellectual Property Rights</h2>
      <p>
        Unless otherwise indicated, the Site and its proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
      </p>

      <h2>3. User Representations</h2>
      <p>
        By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms and Conditions.
      </p>

      <h2>4. Purchases and Payment</h2>
      <p>
        We accept the following forms of payment: Razorpay (Credit/Debit Cards, UPI, Net Banking). You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.
      </p>

      <h2>5. Cancellation</h2>
      <p>
        We reserve the right to refuse any order placed through the Site. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:lahorivenkatesh709@gmail.com">lahorivenkatesh709@gmail.com</a>
      </p>
    </div>
  )
}
