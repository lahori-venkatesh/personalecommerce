'use client'

import AdminSidebar from './AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="lg:ml-64 p-4 lg:p-8">
        {children}
      </main>
    </div>
  )
}

