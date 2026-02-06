import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status, adminNotes } = body

    const validStatuses = ['pending', 'in-review', 'approved', 'rejected', 'completed']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updatedRequest = await prisma.returnRequest.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes })
      }
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error updating return request:', error)
    return NextResponse.json(
      { error: 'Failed to update return request' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const returnRequest = await prisma.returnRequest.findUnique({
      where: { id: params.id }
    })

    if (!returnRequest) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(returnRequest)
  } catch (error) {
    console.error('Error fetching return request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch return request' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.returnRequest.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting return request:', error)
    return NextResponse.json(
      { error: 'Failed to delete return request' },
      { status: 500 }
    )
  }
}
