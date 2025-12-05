'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  CreditCard,
  Home,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-black text-white p-2 rounded-md"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-black text-white transform transition-transform duration-300 ease-in-out z-40
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-sm">VL</span>
              </div>
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname?.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <Home size={20} />
              <span className="font-medium">Back to Site</span>
            </Link>
            <button
              onClick={async () => {
                await fetch('/api/admin/logout', { method: 'POST' })
                window.location.href = '/admin/login'
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

