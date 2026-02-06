'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
  className?: string
  placeholder?: string
  size?: 'default' | 'large'
}

export function SearchBar({ 
  className = '', 
  placeholder = 'Search for help...',
  size = 'default'
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const sizeClasses = size === 'large' 
    ? 'py-4 px-6 text-lg' 
    : 'py-3 px-4 text-base'

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search 
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 ${
            size === 'large' ? 'h-6 w-6' : 'h-5 w-5'
          }`} 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${sizeClasses} pl-12 pr-4 rounded-lg border border-gray-200 
            focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent
            shadow-sm transition-shadow hover:shadow-md`}
        />
      </div>
    </form>
  )
}
