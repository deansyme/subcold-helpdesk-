import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ReturnStatusForm from './ReturnStatusForm'

async function getReturnRequest(id: string) {
  return prisma.returnRequest.findUnique({
    where: { id }
  })
}

export default async function ReturnDetailPage({ params }: { params: { id: string } }) {
  const request = await getReturnRequest(params.id)

  if (!request) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-review': 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const getReasonBadge = (reason: string) => {
    const styles: Record<string, string> = {
      Unwanted: 'bg-amber-100 text-amber-800',
      Damage: 'bg-red-100 text-red-800',
      Faulty: 'bg-blue-100 text-blue-800'
    }
    return styles[reason] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/admin/returns" 
          className="text-sm text-teal-600 hover:text-teal-700 mb-4 inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Returns
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Return Request #{request.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-500 mt-1">
              Submitted on {new Date(request.createdAt).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReasonBadge(request.returnReason)}`}>
              {request.returnReason}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${getStatusBadge(request.status)}`}>
              {request.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{request.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  <a href={`mailto:${request.email}`} className="text-teal-600 hover:underline">
                    {request.email}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium text-gray-900">{request.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purchase Channel</p>
                <p className="font-medium text-gray-900">{request.purchaseChannel}</p>
              </div>
            </div>
          </div>

          {/* Return Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Return Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Return Reason</p>
                <p className="font-medium text-gray-900">{request.returnReason}</p>
              </div>

              {request.unwantedReason && (
                <div>
                  <p className="text-sm text-gray-500">Unwanted Reason</p>
                  <p className="font-medium text-gray-900">{request.unwantedReason}</p>
                </div>
              )}

              {request.productName && (
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-medium text-gray-900">{request.productName}</p>
                </div>
              )}

              {request.serialNumber && (
                <div>
                  <p className="text-sm text-gray-500">Serial Number</p>
                  <p className="font-medium text-gray-900 font-mono">{request.serialNumber}</p>
                </div>
              )}

              {request.troubleshooting && (
                <div>
                  <p className="text-sm text-gray-500">Followed Troubleshooting</p>
                  <p className="font-medium text-gray-900">{request.troubleshooting}</p>
                </div>
              )}

              {request.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-900 whitespace-pre-wrap">{request.description}</p>
                </div>
              )}

              {request.wantsReplacement && (
                <div>
                  <p className="text-sm text-gray-500">Preference</p>
                  <p className="font-medium text-gray-900">{request.wantsReplacement}</p>
                </div>
              )}
            </div>
          </div>

          {/* Photos */}
          {request.photoUrls && request.photoUrls.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {request.photoUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-75 transition"
                  >
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <ReturnStatusForm 
            requestId={request.id} 
            currentStatus={request.status}
            currentNotes={request.adminNotes || ''}
          />

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href={`mailto:${request.email}?subject=Re: Return Request ${request.id.slice(-8).toUpperCase()}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Customer
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Request submitted</p>
                  <p className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleString('en-GB')}
                  </p>
                </div>
              </div>
              {request.updatedAt && request.updatedAt > request.createdAt && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Status updated</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.updatedAt).toLocaleString('en-GB')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
