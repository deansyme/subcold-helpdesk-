'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface TicketFiltersProps {
  currentType: string
  currentStatus: string
}

export default function TicketFilters({ currentType, currentStatus }: TicketFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/admin/tickets?${params.toString()}`)
  }

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'return', label: 'Returns' },
    { value: 'enquiry', label: 'Enquiries' },
    { value: 'support', label: 'Support' },
    { value: 'complaint', label: 'Complaints' }
  ]

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'awaiting-customer', label: 'Awaiting Customer' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ]

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      {/* Type Filter Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => updateFilter('type', type.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentType === type.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Status Dropdown */}
      <select
        value={currentStatus}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
    </div>
  )
}
