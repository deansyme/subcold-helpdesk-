'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import slugify from 'slugify'
import { CategoryTranslations } from '@/components/admin/CategoryTranslations'

const iconOptions = [
  { value: 'Package', label: 'Package (Orders)' },
  { value: 'RotateCcw', label: 'Rotate (Returns)' },
  { value: 'CreditCard', label: 'Credit Card (Payments)' },
  { value: 'Settings', label: 'Settings (Technical)' },
  { value: 'Box', label: 'Box (Product)' },
  { value: 'Info', label: 'Info (General)' },
  { value: 'HelpCircle', label: 'Help Circle' },
]

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
    icon: string
    order: number
    isActive: boolean
  }
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(category?.name || '')
  const [slug, setSlug] = useState(category?.slug || '')
  const [description, setDescription] = useState(category?.description || '')
  const [icon, setIcon] = useState(category?.icon || 'HelpCircle')
  const [order, setOrder] = useState(category?.order || 0)
  const [isActive, setIsActive] = useState(category?.isActive ?? true)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!category) {
      setSlug(slugify(value, { lower: true, strict: true }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = category 
        ? `/api/admin/categories/${category.id}`
        : '/api/admin/categories'
      
      const res = await fetch(url, {
        method: category ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description: description || null,
          icon,
          order,
          isActive,
        }),
      })

      if (res.ok) {
        router.push('/admin/categories')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save category')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            href="/admin/categories"
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {category ? 'Edit Category' : 'New Category'}
            </h1>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-subcold-teal text-white rounded-lg hover:bg-subcold-teal-dark transition-colors disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent"
              placeholder="e.g., Orders & Delivery"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent font-mono text-sm"
              placeholder="orders-delivery"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent"
              placeholder="Brief description of this category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent"
            >
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 text-subcold-teal focus:ring-subcold-teal border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Active (visible on the public site)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Translations Section - Only show when editing */}
      {category && (
        <div className="mt-6">
          <CategoryTranslations
            categoryId={category.id}
            originalName={category.name}
            originalDescription={category.description}
          />
        </div>
      )}
    </form>
  )
}
