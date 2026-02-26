import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import TicketFilters from './TicketFilters'

export const dynamic = 'force-dynamic'

async function getTickets(type?: string, status?: string) {
  return prisma.ticket.findMany({
    where: {
      ...(type && type !== 'all' && { type }),
      ...(status && status !== 'all' && { status })
    },
    include: {
      replies: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

async function getTicketCounts() {
  const [total, open, returns, enquiries] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: 'open' } }),
    prisma.ticket.count({ where: { type: 'return' } }),
    prisma.ticket.count({ where: { type: 'enquiry' } })
  ])
  return { total, open, returns, enquiries }
}

export default async function TicketsPage({
  searchParams
}: {
  searchParams: { type?: string; status?: string }
}) {
  const [tickets, counts] = await Promise.all([
    getTickets(searchParams.type, searchParams.status),
    getTicketCounts()
  ])

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'open': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'awaiting-customer': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-gray-100 text-gray-800',
      'closed': 'bg-gray-200 text-gray-600'
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      return: 'bg-amber-100 text-amber-800',
      enquiry: 'bg-blue-100 text-blue-800',
      support: 'bg-purple-100 text-purple-800',
      complaint: 'bg-red-100 text-red-800'
    }
    return styles[type] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'text-gray-500',
      normal: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    }
    return styles[priority] || 'text-gray-500'
  }

  const formatType = (type: string) => {
    const labels: Record<string, string> = {
      return: 'Return',
      enquiry: 'Enquiry',
      support: 'Support',
      complaint: 'Complaint'
    }
    return labels[type] || type
  }

  const formatStatus = (status: string) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-600 mt-1">Manage customer enquiries and return requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Tickets</p>
          <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Open</p>
          <p className="text-2xl font-bold text-green-600">{counts.open}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Returns</p>
          <p className="text-2xl font-bold text-amber-600">{counts.returns}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Enquiries</p>
          <p className="text-2xl font-bold text-blue-600">{counts.enquiries}</p>
        </div>
      </div>

      {/* Filters */}
      <TicketFilters 
        currentType={searchParams.type || 'all'} 
        currentStatus={searchParams.status || 'all'} 
      />

      {/* Tickets Table */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-500">
            {searchParams.type || searchParams.status 
              ? 'Try adjusting your filters'
              : 'When customers submit enquiries or returns, they will appear here.'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Reply
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => {
                const lastReply = ticket.replies[0]
                const lastMessage = lastReply 
                  ? lastReply.message.replace(/<[^>]*>/g, '').substring(0, 80) 
                  : ticket.message.substring(0, 80)
                
                return (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`mr-2 ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority === 'urgent' && '●'}
                        {ticket.priority === 'high' && '●'}
                        {ticket.priority === 'normal' && '○'}
                        {ticket.priority === 'low' && '○'}
                      </span>
                      <Link href={`/admin/tickets/${ticket.ticketNumber}`} className="font-mono text-sm text-teal-600 hover:text-teal-900 hover:underline">
                        {ticket.ticketNumber}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{ticket.fullName}</div>
                    <div className="text-sm text-gray-500">{ticket.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 truncate max-w-md">
                      {lastMessage}{lastMessage.length >= 80 ? '...' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                    <div className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lastReply ? (
                      <>
                        {new Date(lastReply.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                        <div className="text-xs text-gray-400">
                          {new Date(lastReply.createdAt).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(ticket.type)}`}>
                      {formatType(ticket.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(ticket.status)}`}>
                      {formatStatus(ticket.status)}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
