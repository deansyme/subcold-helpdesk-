'use client'

import { useState } from 'react'

// Product list from the Globo form
const PRODUCTS = [
  'Subcold Classic4 Black',
  'Subcold Classic4 White',
  'Subcold Eco4 Black',
  'Subcold Eco4 White',
  'Subcold Eco75 Black',
  'Subcold Eco75 White',
  'Subcold Pro4 Black',
  'Subcold Pro4 White',
  'Subcold Pro6 Black',
  'Subcold Pro6 White',
  'Subcold Pro6 Vintage',
  'Subcold Pro8 Black',
  'Subcold Pro10 Black',
  'Subcold Pro10 White',
  'Subcold Pro18 Litre Black',
  'Subcold Pro18 Litre White',
  'Subcold Pro25 Litre Black',
  'Subcold Pro25 Litre White',
  'Subcold Pro32 Black',
  'Subcold Pro32 White',
  'Subcold Pro62 Black',
  'Subcold Viva 16 litre',
  'Subcold Viva 24 litre',
  'Subcold Viva 28 litre',
  'Subcold Ultra6 Black'
]

// Products that require serial number
const SERIAL_PRODUCTS = [
  'Subcold Pro18 Litre Black',
  'Subcold Pro18 Litre White',
  'Subcold Pro25 Litre Black',
  'Subcold Pro25 Litre White',
  'Subcold Pro32 Black',
  'Subcold Pro32 White',
  'Subcold Pro62 Black',
  'Subcold Viva 16 litre',
  'Subcold Viva 24 litre',
  'Subcold Viva 28 litre'
]

const PURCHASE_CHANNELS = [
  'Subcold.com',
  'Amazon',
  'eBay',
  'Onbuy',
  'Debenhams',
  'B&Q',
  'Other marketplace'
]

const UNWANTED_REASONS = [
  'Changed my mind',
  'Found better price',
  'Product smaller than expected',
  'Product bigger than expected',
  'Bought by mistake',
  'Other'
]

type ReturnReason = 'Unwanted' | 'Damage' | 'Faulty' | ''

interface FormData {
  returnReason: ReturnReason
  fullName: string
  email: string
  orderNumber: string
  purchaseChannel: string
  unwantedReason: string
  productName: string
  serialNumber: string
  troubleshooting: string
  description: string
  wantsReplacement: string
}

export default function ReturnRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    returnReason: '',
    fullName: '',
    email: '',
    orderNumber: '',
    purchaseChannel: '',
    unwantedReason: '',
    productName: '',
    serialNumber: '',
    troubleshooting: '',
    description: '',
    wantsReplacement: ''
  })
  
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setPhotos(prev => [...prev, ...newFiles])
      
      // Create previews
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPhotoPreviews(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const requiresSerialNumber = SERIAL_PRODUCTS.includes(formData.productName)
  const showUnwantedReason = formData.returnReason === 'Unwanted'
  const showProductDetails = formData.returnReason === 'Damage' || formData.returnReason === 'Faulty'
  const showTroubleshooting = formData.returnReason === 'Faulty'
  const showPhotoUpload = formData.returnReason === 'Damage'
  const showDescription = formData.returnReason === 'Damage' || formData.returnReason === 'Faulty'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Convert photos to base64 for submission
      const photoBase64s: string[] = []
      for (const photo of photos) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(photo)
        })
        photoBase64s.push(base64)
      }

      const response = await fetch('/api/return-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          photos: photoBase64s
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit return request')
      }

      setSubmitStatus('success')
      // Reset form
      setFormData({
        returnReason: '',
        fullName: '',
        email: '',
        orderNumber: '',
        purchaseChannel: '',
        unwantedReason: '',
        productName: '',
        serialNumber: '',
        troubleshooting: '',
        description: '',
        wantsReplacement: ''
      })
      setPhotos([])
      setPhotoPreviews([])
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            We have received your self-return request. Our team will review your submission and get back to you within 1-2 working days.
          </p>
          <p className="text-gray-600 mb-8">
            A confirmation email has been sent to your email address with your request details.
          </p>
          <button
            onClick={() => setSubmitStatus('idle')}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Self-Return Request Form</h2>
      
      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Reason for Return */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Return <span className="text-red-500">*</span>
        </label>
        <select
          name="returnReason"
          value={formData.returnReason}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Please select</option>
          <option value="Unwanted">Unwanted</option>
          <option value="Damage">Damage</option>
          <option value="Faulty">Faulty</option>
        </select>
      </div>

      {/* Full Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Order Number */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="orderNumber"
          value={formData.orderNumber}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="e.g. #12345"
        />
      </div>

      {/* Purchase Channel */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Where did you purchase your product? <span className="text-red-500">*</span>
        </label>
        <select
          name="purchaseChannel"
          value={formData.purchaseChannel}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Please select</option>
          {PURCHASE_CHANNELS.map(channel => (
            <option key={channel} value={channel}>{channel}</option>
          ))}
        </select>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Conditional: Unwanted Reason */}
      {showUnwantedReason && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why is the item unwanted? <span className="text-red-500">*</span>
          </label>
          <select
            name="unwantedReason"
            value={formData.unwantedReason}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Please select</option>
            {UNWANTED_REASONS.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
          <p className="mt-3 text-sm text-gray-600">
            <strong>Note:</strong> For unwanted returns, items must be in original condition with all packaging. 
            Return shipping costs are the customer&apos;s responsibility.
          </p>
        </div>
      )}

      {/* Conditional: Product Details for Damage/Faulty */}
      {showProductDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <select
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Please select your product</option>
              {PRODUCTS.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>

          {/* Serial Number (only for certain products) */}
          {requiresSerialNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Found on the rating label"
              />
              <p className="mt-1 text-sm text-gray-500">
                The serial number can be found on the rating label on the back or bottom of your unit.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Conditional: Troubleshooting for Faulty */}
      {showTroubleshooting && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Have you followed the troubleshooting steps in your user manual? <span className="text-red-500">*</span>
          </label>
          <select
            name="troubleshooting"
            value={formData.troubleshooting}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Please select</option>
            <option value="Yes">Yes, I have followed all steps</option>
            <option value="No">No, I need help with troubleshooting</option>
          </select>
          <p className="mt-3 text-sm text-gray-600">
            Many issues can be resolved by following the troubleshooting guide in your user manual. 
            If you&apos;ve lost your manual, you can find it on our website.
          </p>
        </div>
      )}

      {/* Conditional: Photo Upload for Damage */}
      {showPhotoUpload && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Photos of Damage <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Please upload clear photos showing the damage to help us process your request quickly.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer inline-flex items-center gap-2 text-teal-600 hover:text-teal-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Click to upload photos
            </label>
          </div>

          {photoPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conditional: Description for Damage/Faulty */}
      {showDescription && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please describe the issue <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Please provide as much detail as possible about the issue..."
          />
        </div>
      )}

      {/* Replacement preference for Damage/Faulty */}
      {showProductDetails && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Would you prefer a replacement or refund?
          </label>
          <select
            name="wantsReplacement"
            value={formData.wantsReplacement}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">Please select</option>
            <option value="Replacement">Replacement unit</option>
            <option value="Refund">Full refund</option>
            <option value="Either">No preference</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition ${
          isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-teal-500 hover:bg-teal-600'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit Return Request'
        )}
      </button>

      <p className="mt-4 text-sm text-gray-500 text-center">
        By submitting this form, you agree to our returns policy. We will respond within 1-2 working days.
      </p>
    </form>
  )
}
