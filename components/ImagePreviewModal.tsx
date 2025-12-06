import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ImagePreviewModalProps {
  imageUrl: string
  altText: string
  onClose: () => void
}

const ImagePreviewModal = ({ imageUrl, altText, onClose }: ImagePreviewModalProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[60] text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
      >
        <X size={32} />
      </button>
      <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={imageUrl}
          alt={altText}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}

export default ImagePreviewModal
