import ReturnFormEditor from './ReturnFormEditor'

export default function ReturnFormConfigPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Return Form Editor</h1>
        <p className="text-gray-600 mt-1">Customize the self-return request form fields and options</p>
      </div>
      
      <ReturnFormEditor />
    </div>
  )
}
