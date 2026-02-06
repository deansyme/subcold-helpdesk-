import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// Default configuration
const DEFAULT_CONFIG = {
  products: [
    { name: 'Subcold Classic4 Black', requiresSerial: false },
    { name: 'Subcold Classic4 White', requiresSerial: false },
    { name: 'Subcold Eco4 Black', requiresSerial: false },
    { name: 'Subcold Eco4 White', requiresSerial: false },
    { name: 'Subcold Eco75 Black', requiresSerial: false },
    { name: 'Subcold Eco75 White', requiresSerial: false },
    { name: 'Subcold Pro4 Black', requiresSerial: false },
    { name: 'Subcold Pro4 White', requiresSerial: false },
    { name: 'Subcold Pro6 Black', requiresSerial: false },
    { name: 'Subcold Pro6 White', requiresSerial: false },
    { name: 'Subcold Pro6 Vintage', requiresSerial: false },
    { name: 'Subcold Pro8 Black', requiresSerial: false },
    { name: 'Subcold Pro10 Black', requiresSerial: false },
    { name: 'Subcold Pro10 White', requiresSerial: false },
    { name: 'Subcold Pro18 Litre Black', requiresSerial: true },
    { name: 'Subcold Pro18 Litre White', requiresSerial: true },
    { name: 'Subcold Pro25 Litre Black', requiresSerial: true },
    { name: 'Subcold Pro25 Litre White', requiresSerial: true },
    { name: 'Subcold Pro32 Black', requiresSerial: true },
    { name: 'Subcold Pro32 White', requiresSerial: true },
    { name: 'Subcold Pro62 Black', requiresSerial: true },
    { name: 'Subcold Viva 16 litre', requiresSerial: true },
    { name: 'Subcold Viva 24 litre', requiresSerial: true },
    { name: 'Subcold Viva 28 litre', requiresSerial: true },
    { name: 'Subcold Ultra6 Black', requiresSerial: false },
  ],
  purchaseChannels: [
    'Subcold.com',
    'Amazon',
    'eBay',
    'Onbuy',
    'Debenhams',
    'B&Q',
    'Other marketplace'
  ],
  unwantedReasons: [
    'Changed my mind',
    'Found better price',
    'Product smaller than expected',
    'Product bigger than expected',
    'Bought by mistake',
    'Other'
  ],
  returnReasons: [
    { value: 'Unwanted', label: 'Unwanted', showUnwantedReason: true, showProductDetails: false },
    { value: 'Damage', label: 'Damage', showUnwantedReason: false, showProductDetails: true, showPhotoUpload: true },
    { value: 'Faulty', label: 'Faulty', showUnwantedReason: false, showProductDetails: true, showTroubleshooting: true }
  ],
  replacementOptions: [
    { value: 'Replacement', label: 'Replacement unit' },
    { value: 'Refund', label: 'Full refund' },
    { value: 'Either', label: 'No preference' }
  ],
  troubleshootingOptions: [
    { value: 'Yes', label: 'Yes, I have followed all steps' },
    { value: 'No', label: 'No, I need help with troubleshooting' }
  ],
  formTitle: 'Self-Return Request Form',
  formDescription: '',
  successTitle: 'Request Submitted Successfully!',
  successMessage: 'We have received your self-return request. Our team will review your submission and get back to you within 1-2 working days.',
  requirePhotoForDamage: true
}

export async function GET() {
  try {
    let config = await prisma.returnFormConfig.findUnique({
      where: { id: 'default' }
    })

    // If no config exists, create one with defaults
    if (!config) {
      config = await prisma.returnFormConfig.create({
        data: {
          id: 'default',
          products: DEFAULT_CONFIG.products,
          purchaseChannels: DEFAULT_CONFIG.purchaseChannels,
          unwantedReasons: DEFAULT_CONFIG.unwantedReasons,
          returnReasons: DEFAULT_CONFIG.returnReasons,
          replacementOptions: DEFAULT_CONFIG.replacementOptions,
          troubleshootingOptions: DEFAULT_CONFIG.troubleshootingOptions,
          formTitle: DEFAULT_CONFIG.formTitle,
          formDescription: DEFAULT_CONFIG.formDescription,
          successTitle: DEFAULT_CONFIG.successTitle,
          successMessage: DEFAULT_CONFIG.successMessage,
          requirePhotoForDamage: DEFAULT_CONFIG.requirePhotoForDamage
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching form config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch form configuration' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const config = await prisma.returnFormConfig.upsert({
      where: { id: 'default' },
      update: {
        products: body.products,
        purchaseChannels: body.purchaseChannels,
        unwantedReasons: body.unwantedReasons,
        returnReasons: body.returnReasons,
        replacementOptions: body.replacementOptions,
        troubleshootingOptions: body.troubleshootingOptions,
        formTitle: body.formTitle,
        formDescription: body.formDescription || '',
        successTitle: body.successTitle,
        successMessage: body.successMessage,
        requirePhotoForDamage: body.requirePhotoForDamage
      },
      create: {
        id: 'default',
        products: body.products || DEFAULT_CONFIG.products,
        purchaseChannels: body.purchaseChannels || DEFAULT_CONFIG.purchaseChannels,
        unwantedReasons: body.unwantedReasons || DEFAULT_CONFIG.unwantedReasons,
        returnReasons: body.returnReasons || DEFAULT_CONFIG.returnReasons,
        replacementOptions: body.replacementOptions || DEFAULT_CONFIG.replacementOptions,
        troubleshootingOptions: body.troubleshootingOptions || DEFAULT_CONFIG.troubleshootingOptions,
        formTitle: body.formTitle || DEFAULT_CONFIG.formTitle,
        formDescription: body.formDescription || DEFAULT_CONFIG.formDescription,
        successTitle: body.successTitle || DEFAULT_CONFIG.successTitle,
        successMessage: body.successMessage || DEFAULT_CONFIG.successMessage,
        requirePhotoForDamage: body.requirePhotoForDamage ?? DEFAULT_CONFIG.requirePhotoForDamage
      }
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating form config:', error)
    return NextResponse.json(
      { error: 'Failed to update form configuration' },
      { status: 500 }
    )
  }
}
