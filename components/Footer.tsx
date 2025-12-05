import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Venkatesh Lahori
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Empowering developers to crack their dream jobs through personalized coaching, mentorship, and high-quality resources.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: 'https://x.com/NIT_Venkatesh' },
                { icon: Github, href: 'https://github.com/lahori-venkatesh' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/venkatesh-lahori/' },
                { icon: Mail, href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'lahorivenkatesh709@gmail.com'}` },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4 sm:space-y-3">
              {['Home', 'About', 'Services', 'Notes'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Legal</h4>
            <ul className="space-y-4 sm:space-y-3">
              {[
                { name: 'Privacy Policy', href: '/policies/privacy-policy' },
                { name: 'Terms & Conditions', href: '/policies/terms-and-conditions' },
                { name: 'Refund Policy', href: '/policies/refund-policy' },
                { name: 'Shipping Policy', href: '/policies/shipping-policy' },
                { name: 'Contact Us', href: '/policies/contact-us' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm gap-4">
          <p>© {new Date().getFullYear()} Venkatesh Lahori. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Designed with <span className="text-red-500">❤</span> for developers
          </p>
        </div>
      </div>
    </footer>
  )
}
