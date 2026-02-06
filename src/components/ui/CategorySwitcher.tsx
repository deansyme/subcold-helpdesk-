'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
}

interface CategorySwitcherProps {
  categories: Category[]
  currentCategorySlug: string
}

export function CategorySwitcher({ categories, currentCategorySlug }: CategorySwitcherProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value
    if (slug) {
      router.push(`/category/${slug}`)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Dropdown */}
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select category
            </label>
            <div className="relative">
              <select
                id="category-select"
                value={currentCategorySlug}
                onChange={handleCategoryChange}
                className="w-full appearance-none px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent cursor-pointer text-gray-900"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Global Search */}
          <div>
            <label htmlFor="global-search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <form onSubmit={handleSearch} className="relative">
              <input
                id="global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by typing keywords..."
                className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-subcold-teal"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
