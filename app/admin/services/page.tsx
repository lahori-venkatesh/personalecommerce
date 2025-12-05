'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import CloudinaryUploadWidget from '@/components/CloudinaryUploadWidget'

interface Service {
  id: string
  title: string
  description: string
  duration?: string
  format?: string
  price: number
  includes: string[]
  isActive: boolean
  category: string
  requiredInput: string
  salesCount: number
  showSalesCount: boolean
  autoIncrementSales: boolean
  isPopular: boolean
  isBestSeller: boolean
  meetingUrl?: string
  features: string[]
  resumePreviewImage?: string
  resumeGuidePdf?: string
  resumeTemplateLink?: string
  whatsappGroupLink?: string
  platform?: string
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    format: '',
    price: '',
    includes: '',
    isActive: true,
    category: 'Mock Interview',
    requiredInput: 'None',
    salesCount: 0,
    showSalesCount: false,
    autoIncrementSales: false,
    isPopular: false,
    isBestSeller: false,
    meetingUrl: '',
    features: '',
    resumePreviewImage: '',
    resumeGuidePdf: '',
    resumeTemplateLink: '',
    whatsappGroupLink: '',
    platform: ''
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      if (Array.isArray(data)) {
        setServices(data)
      } else {
        console.warn('API returned non-array data:', data)
        setServices([])
      }
      setLoading(false)
    } catch (error) {
      console.warn('Error fetching services (using empty list):', error)
      setServices([])
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const includesArray = formData.includes.split('\n').filter(item => item.trim())
    const featuresArray = formData.features.split('\n').filter(item => item.trim())

    try {
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services'
      const method = editingService ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          includes: includesArray,
          features: featuresArray,
          price: parseFloat(formData.price)
        })
      })

      if (res.ok) {
        fetchServices()
        setShowForm(false)
        setEditingService(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Failed to save service')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      format: '',
      price: '',
      includes: '',
      isActive: true,
      category: 'Mock Interview',
      requiredInput: 'None',
      salesCount: 0,
      showSalesCount: false,
      autoIncrementSales: false,
      isPopular: false,
      isBestSeller: false,
      meetingUrl: '',
      features: '',
      resumePreviewImage: '',
      resumeGuidePdf: '',
      resumeTemplateLink: '',
      whatsappGroupLink: '',
      platform: ''
    })
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      duration: service.duration || '',
      format: service.format || '',
      price: service.price.toString(),
      includes: service.includes.join('\n'),
      isActive: service.isActive,
      category: service.category || 'Mock Interview',
      requiredInput: service.requiredInput || 'None',
      salesCount: service.salesCount || 0,
      showSalesCount: service.showSalesCount || false,
      autoIncrementSales: service.autoIncrementSales || false,
      isPopular: service.isPopular || false,
      isBestSeller: service.isBestSeller || false,
      meetingUrl: service.meetingUrl || '',
      features: (service.features || []).join('\n'),
      resumePreviewImage: service.resumePreviewImage || '',
      resumeGuidePdf: service.resumeGuidePdf || '',
      resumeTemplateLink: service.resumeTemplateLink || '',
      whatsappGroupLink: service.whatsappGroupLink || '',
      platform: service.platform || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Failed to delete service')
    }
  }

  return (
    <div>
      {/* ... (Header and Add Service button remain same) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingService(null)
            resetForm()
          }}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Mock Interview">Mock Interview</option>
                  <option value="Tech Interview Preparation">Tech Interview Preparation</option>
                  <option value="Premium WhatsApp Community">Premium WhatsApp Community</option>
                  <option value="1:1 Session">1:1 Session</option>
                  <option value="LinkedIn Optimization">LinkedIn Optimization</option>
                  <option value="Priority DM">Priority DM</option>
                  <option value="Resume Review">Resume Review</option>
                  <option value="Resume Templates">Resume Templates</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            {formData.category === 'Resume Templates' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume Preview Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.resumePreviewImage}
                        onChange={(e) => setFormData({ ...formData, resumePreviewImage: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="https://..."
                      />
                      <CloudinaryUploadWidget
                        onUpload={(url) => setFormData(prev => ({ ...prev, resumePreviewImage: url }))}
                        folder="services"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <input
                      type="text"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g. Figma, Canva"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume Guide PDF URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.resumeGuidePdf}
                        onChange={(e) => setFormData({ ...formData, resumeGuidePdf: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="https://..."
                      />
                      <CloudinaryUploadWidget
                        onUpload={(url) => setFormData(prev => ({ ...prev, resumeGuidePdf: url }))}
                        buttonText="Upload PDF"
                        folder="services/pdfs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.resumeTemplateLink}
                        onChange={(e) => setFormData({ ...formData, resumeTemplateLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="https://..."
                      />
                      <CloudinaryUploadWidget
                        onUpload={(url) => setFormData(prev => ({ ...prev, resumeTemplateLink: url }))}
                        buttonText="Upload File"
                        folder="services/templates"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 60-minute session"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                  <input
                    type="text"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 1-on-1 Video Call"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {formData.category !== 'Resume Templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting URL (Optional)</label>
                    <input
                      type="text"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      placeholder="Zoom/Meet Link"
                    />
                  </div>
                  {formData.category === 'Premium WhatsApp Community' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Group Link (Optional)</label>
                      <input
                        type="text"
                        value={formData.whatsappGroupLink}
                        onChange={(e) => setFormData({ ...formData, whatsappGroupLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        placeholder="https://chat.whatsapp.com/..."
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Customer Input</label>
                <select
                  value={formData.requiredInput}
                  onChange={(e) => setFormData({ ...formData, requiredInput: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="None">None</option>
                  <option value="Resume">Resume Upload</option>
                  <option value="LinkedIn">LinkedIn Profile</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900">Sales & Badges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sales Count</label>
                  <input
                    type="number"
                    value={formData.salesCount}
                    onChange={(e) => setFormData({ ...formData, salesCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showSalesCount"
                      checked={formData.showSalesCount}
                      onChange={(e) => setFormData({ ...formData, showSalesCount: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="showSalesCount" className="text-sm text-gray-700">Show Sales Count on Frontend</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoIncrementSales"
                      checked={formData.autoIncrementSales}
                      onChange={(e) => setFormData({ ...formData, autoIncrementSales: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="autoIncrementSales" className="text-sm text-gray-700">Auto Increment Sales</label>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isPopular" className="text-sm text-gray-700">Popular Badge</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isBestSeller" className="text-sm text-gray-700">Best Seller Badge</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Includes (one per line)
                </label>
                <textarea
                  value={formData.includes}
                  onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Behavioral & technical questions&#10;Live performance feedback"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Add extra features here..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingService(null)
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{service.title}</div>
                    <div className="text-sm text-gray-500">{service.description.substring(0, 50)}...</div>
                    <div className="flex gap-2 mt-1">
                      {service.isPopular && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Popular</span>}
                      {service.isBestSeller && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Best Seller</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{service.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-black hover:text-gray-700 mr-4"
                    >
                      <Edit size={18} className="inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

