'use client'

import { useState, useEffect } from 'react'
import BookingModal from './BookingModal'
import ProductDetailsModal from './ProductDetailsModal'
import { Star, Eye, ShoppingCart, BookOpen, Award, TrendingUp, ArrowRight, FileText } from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  detailedDescription?: string
  excerpt?: string
  price: number
  rating: number
  soldCount: number
  previewUrl?: string
  fileUrl?: string
  image?: string
  category?: string
  isPopular?: boolean
  isBestSeller?: boolean
}

const ProductCard = ({ product, onDetails, onPreview, index }: { product: Product; onDetails: (p: Product) => void; onPreview: (p: Product) => void; index: number }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full min-h-[400px]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="h-48 bg-gray-100 overflow-hidden relative flex-shrink-0">
        {product.image || product.previewUrl ? (
          <img
            src={product.image || product.previewUrl}
            alt={product.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <BookOpen size={48} className="text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
          {product.isBestSeller ? (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Award size={10} /> Best Seller
            </span>
          ) : product.isPopular ? (
            <span className="bg-yellow-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <TrendingUp size={10} /> Popular
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
          ₹{product.price}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="ml-1 text-xs font-bold text-yellow-700">
                {product.rating}
              </span>
            </div>
            {product.category && (
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                {product.category}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
            {product.soldCount} sold
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {product.title}
        </h3>

        <div className="mb-4 flex-grow">
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.excerpt || product.description}
          </p>
        </div>

        <div className="mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDetails(product)
            }}
            className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
          >
            View details <ArrowRight size={14} />
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => onPreview(product)}
              className="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Eye size={18} />
              Preview
            </button>
            <button
              onClick={() => onDetails(product)}
              className="flex-1 bg-primary-600 text-white py-2.5 px-4 rounded-xl hover:bg-primary-700 font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
            >
              <ShoppingCart size={18} />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err))
  }, [])

  const handleDetails = (product: Product) => {
    setDetailsProduct(product)
  }

  const handleBuyNow = (product: Product) => {
    setDetailsProduct(null) // Close details modal if open
    setSelectedProduct(product)
    setShowModal(true)
  }

  const handlePreview = (product: Product) => {
    if (product.previewUrl) {
      window.open(product.previewUrl, '_blank')
    } else {
      alert(`Preview for ${product.title}\n\n${product.excerpt || product.description}`)
    }
  }

  // Default products if API fails
  const defaultProducts: Product[] = [
    {
      id: '1',
      title: 'DSA Interview Questions',
      description: '75 top company questions — easy to medium difficulty. Comprehensive coverage of arrays, strings, trees, graphs, and dynamic programming.',
      excerpt: '75 top company questions — easy to medium difficulty.',
      price: 99,
      rating: 4.9,
      soldCount: 3,
      previewUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      category: 'Notes',
      isBestSeller: true
    },
    {
      id: '2',
      title: 'System Design Interview Guide',
      description: 'Complete guide to system design interviews with real-world examples and best practices.',
      excerpt: 'Complete guide to system design interviews',
      price: 199,
      rating: 4.8,
      soldCount: 5,
      previewUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      category: 'Interview Question',
      isPopular: true
    },
    {
      id: '3',
      title: 'Behavioral Interview Questions',
      description: '100+ behavioral questions with sample answers and STAR method examples.',
      excerpt: '100+ behavioral questions with sample answers',
      price: 149,
      rating: 4.7,
      soldCount: 2,
      previewUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
      category: 'Other'
    }
  ]

  const displayProducts = products.length > 0 ? products : defaultProducts

  return (
    <>
      <section id="notes" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Digital Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Curated notes and guides to accelerate your interview preparation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onDetails={handleDetails}
                onPreview={handlePreview}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {detailsProduct && (
        <ProductDetailsModal
          product={detailsProduct}
          onClose={() => setDetailsProduct(null)}
          onBuy={handleBuyNow}
          onPreview={handlePreview}
        />
      )}

      {showModal && selectedProduct && (
        <BookingModal
          type="product"
          product={selectedProduct}
          onClose={() => {
            setShowModal(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </>
  )
}

