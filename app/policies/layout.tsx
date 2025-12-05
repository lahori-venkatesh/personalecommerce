import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
