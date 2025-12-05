'use client'

import { useEffect, useRef } from 'react'
import { Image as ImageIcon, Upload } from 'lucide-react'

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void
  buttonText?: string
  folder?: string
}

declare global {
  interface Window {
    cloudinary: any
  }
}

export default function CloudinaryUploadWidget({
  onUpload,
  buttonText = "Upload Image",
  folder = "personal-project"
}: CloudinaryUploadWidgetProps) {
  const cloudinaryRef = useRef<any>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    const loadScript = () => {
      if (window.cloudinary) {
        initWidget()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://upload-widget.cloudinary.com/global/all.js'
      script.async = true
      script.onload = initWidget
      document.body.appendChild(script)
    }

    const initWidget = () => {
      if (cloudinaryRef.current) return

      cloudinaryRef.current = window.cloudinary

      // Replace with your actual cloud name and upload preset
      // Ideally these should be in env vars: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset'

      widgetRef.current = cloudinaryRef.current.createUploadWidget({
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        folder: folder,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        clientAllowedFormats: ['image', 'pdf'],
        maxImageFileSize: 5000000, // 5MB
      }, (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log('Upload success:', result.info.secure_url)
          onUpload(result.info.secure_url)
        }
      })
    }

    loadScript()
  }, [onUpload, folder])

  const openWidget = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    if (widgetRef.current) {
      widgetRef.current.open()
    } else {
      console.warn('Cloudinary widget not loaded yet')
    }
  }

  return (
    <button
      onClick={openWidget}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors border border-gray-300"
    >
      <Upload size={18} />
      <span>{buttonText}</span>
    </button>
  )
}
