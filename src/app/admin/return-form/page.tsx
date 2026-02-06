import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ReturnFormEditor from './ReturnFormEditor'

export default async function ReturnFormConfigPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Return Form Editor</h1>
        <p className="text-gray-600 mt-1">Customize the self-return request form fields and options</p>
      </div>
      
      <ReturnFormEditor />
    </div>
  )
}
