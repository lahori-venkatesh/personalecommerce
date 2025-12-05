import { X, Star, Eye, ShoppingCart, CheckCircle2, Award, TrendingUp, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'

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

interface ProductDetailsModalProps {
  product: Product
  onClose: () => void
  onBuy: (product: Product) => void
  onPreview: (product: Product) => void
}

export default function ProductDetailsModal({ product, onClose, onBuy, onPreview }: ProductDetailsModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 transform transition-all duration-300 flex flex-col ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-lg">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="ml-1.5 text-sm font-bold text-yellow-700">
                {product.rating}
              </span>
            </div>
            <span className="text-sm text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-lg">
              {product.soldCount} sold
            </span>
            {product.category && (
              <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg">
                {product.category}
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <Award size={12} /> Best Seller
              </span>
            )}
            {product.isPopular && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <TrendingUp size={12} /> Popular
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {product.title}
          </h2>

          <div className="prose prose-sm text-gray-600 mb-8 flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-base leading-relaxed mb-4">
              {product.description}
            </p>
            {product.detailedDescription && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Overview</h3>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {product.detailedDescription}
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Total Price</span>
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onPreview(product)}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3.5 px-6 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Eye size={20} />
                Preview
              </button>
              <button
                onClick={() => onBuy(product)}
                className="flex-[2] bg-gray-900 text-white py-3.5 px-6 rounded-xl hover:bg-primary-600 font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-gray-200 hover:shadow-primary-500/30"
              >
                <ShoppingCart size={20} />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
