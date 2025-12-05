'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Services', href: '/admin/services', icon: Users }, // Using Users icon for services temporarily or find better one
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Hero Settings', href: '/admin/settings/hero', icon: Settings },
  ]

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0 shadow-2xl`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'
                      }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group">
              <LogOut className="mr-3 h-5 w-5 group-hover:text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-900">Admin Panel</span>
          <div className="w-6" /> {/* Spacer */}
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
