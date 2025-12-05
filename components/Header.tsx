'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="glass mx-4 mt-4 rounded-2xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Name */}
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                Venkatesh Lahori
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {['Home', 'About', 'Services', 'Notes'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors relative group"
                >
                  {item}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                href="/account"
                className="text-gray-600 hover:text-primary-600 px-4 py-2 text-sm font-medium transition-colors"
              >
                My Orders
              </Link>
              <Link
                href="#support"
                className="bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
              >
                Support
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-primary-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 animate-fade-in bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-xl absolute left-0 right-0 top-full mx-4 mt-2">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {['Home', 'About', 'Services', 'Notes'].map((item) => (
                  <Link
                    key={item}
                    href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-100 mt-2 space-y-2">
                  <Link
                    href="/account"
                    className="block px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="#support"
                    className="block px-3 py-2 bg-primary-600 text-white rounded-lg text-center font-medium hover:bg-primary-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Support
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

