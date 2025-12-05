'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, Trash2 } from 'lucide-react'

interface Stat {
  label: string
  value: string
}

interface HeroSettings {
  id: string
  title: string
  subtitle: string
  theme: string
  button1Text: string
  button1Link: string
  button1Show: boolean
  button2Text: string
  button2Link: string
  button2Show: boolean
  stats: Stat[]
}

export default function HeroSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<HeroSettings>({
    id: '',
    title: '',
    subtitle: '',
    theme: 'Modern',
    button1Text: '',
    button1Link: 'session',
    button1Show: true,
    button2Text: '',
    button2Link: 'priority-dm',
    button2Show: true,
    stats: []
  })
  const [services, setServices] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetchSettings()
    fetchServicesAndProducts()
  }, [])

  const fetchServicesAndProducts = async () => {
    try {
      const [servicesRes, productsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/products')
      ])
      const servicesData = await servicesRes.json()
      const productsData = await productsRes.json()

      if (Array.isArray(servicesData)) {
        setServices(servicesData)
      } else {
        console.error('Services data is not an array:', servicesData)
        setServices([])
      }

      if (Array.isArray(productsData)) {
        setProducts(productsData)
      } else {
        console.error('Products data is not an array:', productsData)
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching services/products:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/hero')
      const data = await res.json()
      if (data) {
        setSettings({
          ...data,
          stats: typeof data.stats === 'string' ? JSON.parse(data.stats) : (data.stats || [])
        })
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          stats: JSON.stringify(settings.stats)
        })
      })

      if (res.ok) {
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const addStat = () => {
    setSettings({
      ...settings,
      stats: [...settings.stats, { label: '', value: '' }]
    })
  }

  const removeStat = (index: number) => {
    const newStats = [...settings.stats]
    newStats.splice(index, 1)
    setSettings({ ...settings, stats: newStats })
  }

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...settings.stats]
    newStats[index][field] = value
    setSettings({ ...settings, stats: newStats })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hero Section Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">

        {/* Theme Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Modern', 'Minimal', 'Bold'].map((theme) => (
              <div
                key={theme}
                onClick={() => setSettings({ ...settings, theme })}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${settings.theme === theme
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="font-medium text-center">{theme}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Content</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <textarea
              value={settings.subtitle}
              onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Buttons</h2>

          {/* Button 1 */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Primary Button</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.button1Show}
                  onChange={(e) => setSettings({ ...settings, button1Show: e.target.checked })}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Show</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                <input
                  type="text"
                  value={settings.button1Text}
                  onChange={(e) => setSettings({ ...settings, button1Text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={settings.button1Link}
                  onChange={(e) => setSettings({ ...settings, button1Link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="session">Book Session Modal (Default)</option>
                  <option value="priority-dm">Priority DM Modal (Default)</option>
                  <option value="notes">Notes Section</option>
                  <optgroup label="Services">
                    {services.map((service) => (
                      <option key={service.id} value={`service:${service.id}`}>
                        Service: {service.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Products">
                    {products.map((product) => (
                      <option key={product.id} value={`product:${product.id}`}>
                        Product: {product.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Button 2 */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Secondary Button</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.button2Show}
                  onChange={(e) => setSettings({ ...settings, button2Show: e.target.checked })}
                  className="rounded text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Show</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                <input
                  type="text"
                  value={settings.button2Text}
                  onChange={(e) => setSettings({ ...settings, button2Text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={settings.button2Link}
                  onChange={(e) => setSettings({ ...settings, button2Link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="session">Book Session Modal (Default)</option>
                  <option value="priority-dm">Priority DM Modal (Default)</option>
                  <option value="notes">Notes Section</option>
                  <optgroup label="Services">
                    {services.map((service) => (
                      <option key={service.id} value={`service:${service.id}`}>
                        Service: {service.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Products">
                    {products.map((product) => (
                      <option key={product.id} value={`product:${product.id}`}>
                        Product: {product.title}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
            <button
              type="button"
              onClick={addStat}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <Plus size={16} />
              Add Stat
            </button>
          </div>
          <div className="space-y-4">
            {settings.stats?.map((stat, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Value (e.g. 500+)"
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Label (e.g. Students Mentored)"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
