import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Package, Calendar, User, MessageSquare } from 'lucide-react'
import TicketStatusForm from './TicketStatusForm'
import TicketConversation from './TicketConversation'
import TicketReplyForm from './TicketReplyForm'

export const dynamic = 'force-dynamic'

async function getTicket(ticketRef: string) {
  // Support both ID and ticket number
  const ticket = await prisma.ticket.findFirst({
    where: {
      OR: [
        { id: ticketRef },
        { ticketNumber: ticketRef }
      ]
    },
    include: {
      replies: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })
  return ticket
}

export default async function TicketDetailPage({
  params
}: {
  params: { id: string }
}) {
  const ticket = await getTicket(params.id)

  if (!ticket) {
    notFound()
  }

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
      low: 'bg-gray-100 text-gray-600',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    }
    return styles[priority] || 'bg-gray-100 text-gray-600'
  }

  const formatType = (type: string) => {
    const labels: Record<string, string> = {
      return: 'Return Request',
      enquiry: 'General Enquiry',
      support: 'Support Request',
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
    <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
      {/* Back Button */}
      <Link 
        href="/admin/tickets"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tickets
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 font-mono">
                {ticket.ticketNumber}
              </h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeBadge(ticket.type)}`}>
                {formatType(ticket.type)}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(ticket.status)}`}>
                {formatStatus(ticket.status)}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityBadge(ticket.priority)}`}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
              </span>
            </div>
            <h2 className="text-lg text-gray-700">{ticket.subject}</h2>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(ticket.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          {/* Customer Message */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              Message
            </h3>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {ticket.message}
            </div>
          </div>

          {/* Return-Specific Details */}
          {ticket.type === 'return' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                Return Details
              </h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ticket.orderNumber && (
                  <div>
                    <dt className="text-sm text-gray-500">Order Number</dt>
                    <dd className="font-medium text-gray-900">{ticket.orderNumber}</dd>
                  </div>
                )}
                {ticket.purchaseChannel && (
                  <div>
                    <dt className="text-sm text-gray-500">Purchase Channel</dt>
                    <dd className="font-medium text-gray-900 capitalize">{ticket.purchaseChannel}</dd>
                  </div>
                )}
                {ticket.productName && (
                  <div>
                    <dt className="text-sm text-gray-500">Product</dt>
                    <dd className="font-medium text-gray-900">{ticket.productName}</dd>
                  </div>
                )}
                {ticket.serialNumber && (
                  <div>
                    <dt className="text-sm text-gray-500">Serial Number</dt>
                    <dd className="font-medium text-gray-900 font-mono">{ticket.serialNumber}</dd>
                  </div>
                )}
                {ticket.returnReason && (
                  <div className="md:col-span-2">
                    <dt className="text-sm text-gray-500">Return Reason</dt>
                    <dd className="font-medium text-gray-900 capitalize">{ticket.returnReason}</dd>
                  </div>
                )}
                {ticket.unwantedReason && (
                  <div className="md:col-span-2">
                    <dt className="text-sm text-gray-500">Unwanted Reason</dt>
                    <dd className="font-medium text-gray-900">{ticket.unwantedReason}</dd>
                  </div>
                )}
                {ticket.troubleshooting && (
                  <div className="md:col-span-2">
                    <dt className="text-sm text-gray-500">Troubleshooting Steps</dt>
                    <dd className="text-gray-900 whitespace-pre-wrap">{ticket.troubleshooting}</dd>
                  </div>
                )}
                {ticket.wantsReplacement && (
                  <div>
                    <dt className="text-sm text-gray-500">Wants Replacement</dt>
                    <dd className="font-medium text-gray-900">{ticket.wantsReplacement}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Admin Actions */}
          <TicketStatusForm ticket={ticket} />

          {/* Conversation Thread */}
          <TicketConversation 
            initialMessage={ticket.message}
            customerName={ticket.fullName}
            createdAt={ticket.createdAt}
            replies={ticket.replies}
          />

          {/* Reply Form */}
          <TicketReplyForm ticketId={ticket.id} customerEmail={ticket.email} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              Customer Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">{ticket.fullName}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${ticket.email}`} className="text-teal-600 hover:underline">
                  {ticket.email}
                </a>
              </div>
              {ticket.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${ticket.phone}`} className="text-teal-600 hover:underline">
                    {ticket.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href={`mailto:${ticket.email}?subject=Re: ${ticket.ticketNumber} - ${ticket.subject}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Open in Email Client
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
