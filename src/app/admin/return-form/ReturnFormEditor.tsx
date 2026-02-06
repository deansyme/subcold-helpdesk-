'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical, Save, ChevronDown, ChevronUp } from 'lucide-react'

interface Product {
  name: string
  requiresSerial: boolean
}

interface ReturnReason {
  value: string
  label: string
  showUnwantedReason?: boolean
  showProductDetails?: boolean
  showPhotoUpload?: boolean
  showTroubleshooting?: boolean
}

interface SelectOption {
  value: string
  label: string
}

interface FormConfig {
  products: Product[]
  purchaseChannels: string[]
  unwantedReasons: string[]
  returnReasons: ReturnReason[]
  replacementOptions: SelectOption[]
  troubleshootingOptions: SelectOption[]
  formTitle: string
  formDescription: string
  successTitle: string
  successMessage: string
  requirePhotoForDamage: boolean
}

export default function ReturnFormEditor() {
  const [config, setConfig] = useState<FormConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    general: true,
    products: false,
    channels: false,
    reasons: false,
    returnReasons: false,
    options: false
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/return-form-config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Error fetching config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return
    
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/return-form-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Form configuration saved successfully!' })
      } else {
        throw new Error('Failed to save')
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save configuration' })
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Product management
  const addProduct = () => {
    if (!config) return
    setConfig({
      ...config,
      products: [...config.products, { name: '', requiresSerial: false }]
    })
  }

  const updateProduct = (index: number, field: keyof Product, value: string | boolean) => {
    if (!config) return
    const newProducts = [...config.products]
    newProducts[index] = { ...newProducts[index], [field]: value }
    setConfig({ ...config, products: newProducts })
  }

  const removeProduct = (index: number) => {
    if (!config) return
    setConfig({
      ...config,
      products: config.products.filter((_, i) => i !== index)
    })
  }

  // Channel management
  const addChannel = () => {
    if (!config) return
    setConfig({
      ...config,
      purchaseChannels: [...config.purchaseChannels, '']
    })
  }

  const updateChannel = (index: number, value: string) => {
    if (!config) return
    const newChannels = [...config.purchaseChannels]
    newChannels[index] = value
    setConfig({ ...config, purchaseChannels: newChannels })
  }

  const removeChannel = (index: number) => {
    if (!config) return
    setConfig({
      ...config,
      purchaseChannels: config.purchaseChannels.filter((_, i) => i !== index)
    })
  }

  // Unwanted reasons management
  const addUnwantedReason = () => {
    if (!config) return
    setConfig({
      ...config,
      unwantedReasons: [...config.unwantedReasons, '']
    })
  }

  const updateUnwantedReason = (index: number, value: string) => {
    if (!config) return
    const newReasons = [...config.unwantedReasons]
    newReasons[index] = value
    setConfig({ ...config, unwantedReasons: newReasons })
  }

  const removeUnwantedReason = (index: number) => {
    if (!config) return
    setConfig({
      ...config,
      unwantedReasons: config.unwantedReasons.filter((_, i) => i !== index)
    })
  }

  // Return reasons management
  const addReturnReason = () => {
    if (!config) return
    setConfig({
      ...config,
      returnReasons: [...config.returnReasons, { 
        value: '', 
        label: '', 
        showUnwantedReason: false,
        showProductDetails: false,
        showPhotoUpload: false,
        showTroubleshooting: false
      }]
    })
  }

  const updateReturnReason = (index: number, field: string, value: string | boolean) => {
    if (!config) return
    const newReasons = [...config.returnReasons]
    newReasons[index] = { ...newReasons[index], [field]: value }
    setConfig({ ...config, returnReasons: newReasons })
  }

  const removeReturnReason = (index: number) => {
    if (!config) return
    setConfig({
      ...config,
      returnReasons: config.returnReasons.filter((_, i) => i !== index)
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Failed to load form configuration
      </div>
    )
  }

  const SectionHeader = ({ id, title, description }: { id: string, title: string, description: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
    >
      <div className="text-left">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {expandedSections[id] ? (
        <ChevronUp className="h-5 w-5 text-gray-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-400" />
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SectionHeader 
          id="general" 
          title="General Settings" 
          description="Form title, description, and success messages" 
        />
        {expandedSections.general && (
          <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
              <input
                type="text"
                value={config.formTitle}
                onChange={(e) => setConfig({ ...config, formTitle: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Description (optional)</label>
              <textarea
                value={config.formDescription}
                onChange={(e) => setConfig({ ...config, formDescription: e.target.value })}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Success Title</label>
              <input
                type="text"
                value={config.successTitle}
                onChange={(e) => setConfig({ ...config, successTitle: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
              <textarea
                value={config.successMessage}
                onChange={(e) => setConfig({ ...config, successMessage: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requirePhoto"
                checked={config.requirePhotoForDamage}
                onChange={(e) => setConfig({ ...config, requirePhotoForDamage: e.target.checked })}
                className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <label htmlFor="requirePhoto" className="text-sm text-gray-700">
                Require photo upload for damage claims
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SectionHeader 
          id="products" 
          title="Products" 
          description={`${config.products.length} products configured`}
        />
        {expandedSections.products && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="space-y-2 mb-4">
              {config.products.map((product, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(index, 'name', e.target.value)}
                    placeholder="Product name"
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={product.requiresSerial}
                      onChange={(e) => updateProduct(index, 'requiresSerial', e.target.checked)}
                      className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    Requires Serial
                  </label>
                  <button
                    onClick={() => removeProduct(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addProduct}
              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        )}
      </div>

      {/* Purchase Channels */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SectionHeader 
          id="channels" 
          title="Purchase Channels" 
          description={`${config.purchaseChannels.length} channels configured`}
        />
        {expandedSections.channels && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="space-y-2 mb-4">
              {config.purchaseChannels.map((channel, index) => (
                <div key={index} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <input
                    type="text"
                    value={channel}
                    onChange={(e) => updateChannel(index, e.target.value)}
                    placeholder="Channel name"
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeChannel(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addChannel}
              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
            >
              <Plus className="h-4 w-4" />
              Add Channel
            </button>
          </div>
        )}
      </div>

      {/* Unwanted Reasons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SectionHeader 
          id="reasons" 
          title="Unwanted Reasons" 
          description={`${config.unwantedReasons.length} reasons configured`}
        />
        {expandedSections.reasons && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">
              These options appear when a customer selects &quot;Unwanted&quot; as their return reason.
            </p>
            <div className="space-y-2 mb-4">
              {config.unwantedReasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => updateUnwantedReason(index, e.target.value)}
                    placeholder="Reason"
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeUnwantedReason(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addUnwantedReason}
              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
            >
              <Plus className="h-4 w-4" />
              Add Reason
            </button>
          </div>
        )}
      </div>

      {/* Return Reasons (with conditions) */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <SectionHeader 
          id="returnReasons" 
          title="Return Reasons & Conditions" 
          description="Configure which fields appear for each return type"
        />
        {expandedSections.returnReasons && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="space-y-4 mb-4">
              {config.returnReasons.map((reason, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Value (internal)</label>
                        <input
                          type="text"
                          value={reason.value}
                          onChange={(e) => updateReturnReason(index, 'value', e.target.value)}
                          placeholder="e.g. Unwanted"
                          className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Label (display)</label>
                        <input
                          type="text"
                          value={reason.label}
                          onChange={(e) => updateReturnReason(index, 'label', e.target.value)}
                          placeholder="e.g. Unwanted"
                          className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeReturnReason(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">When this reason is selected, show:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={reason.showUnwantedReason || false}
                          onChange={(e) => updateReturnReason(index, 'showUnwantedReason', e.target.checked)}
                          className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        Unwanted reason dropdown
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={reason.showProductDetails || false}
                          onChange={(e) => updateReturnReason(index, 'showProductDetails', e.target.checked)}
                          className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        Product selection & details
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={reason.showPhotoUpload || false}
                          onChange={(e) => updateReturnReason(index, 'showPhotoUpload', e.target.checked)}
                          className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        Photo upload
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={reason.showTroubleshooting || false}
                          onChange={(e) => updateReturnReason(index, 'showTroubleshooting', e.target.checked)}
                          className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        Troubleshooting question
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addReturnReason}
              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
            >
              <Plus className="h-4 w-4" />
              Add Return Reason
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          <Save className="h-5 w-5" />
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  )
}
