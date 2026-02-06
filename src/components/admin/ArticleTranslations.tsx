'use client'

import { useState, useEffect } from 'react'
import { Globe, Plus, Trash2, Save, X, ChevronDown, ChevronUp } from 'lucide-react'

const LOCALES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
]

interface ArticleTranslation {
  id: string
  articleId: string
  locale: string
  title: string
  content: string
  excerpt: string | null
}

interface ArticleTranslationsProps {
  articleId: string
  originalTitle: string
  originalContent: string
  originalExcerpt: string | null
}

export function ArticleTranslations({
  articleId,
  originalTitle,
  originalContent,
  originalExcerpt
}: ArticleTranslationsProps) {
  const [translations, setTranslations] = useState<ArticleTranslation[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editingLocale, setEditingLocale] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    excerpt: ''
  })

  useEffect(() => {
    fetchTranslations()
  }, [articleId])

  async function fetchTranslations() {
    try {
      const response = await fetch(`/api/admin/translations?type=article&id=${articleId}`)
      if (response.ok) {
        const data = await response.json()
        setTranslations(data)
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error)
    } finally {
      setLoading(false)
    }
  }

  function getAvailableLocales() {
    const usedLocales = translations.map(t => t.locale)
    return LOCALES.filter(l => !usedLocales.includes(l.code))
  }

  function startEditing(locale: string, existingTranslation?: ArticleTranslation) {
    setEditingLocale(locale)
    if (existingTranslation) {
      setEditForm({
        title: existingTranslation.title,
        content: existingTranslation.content,
        excerpt: existingTranslation.excerpt || ''
      })
    } else {
      setEditForm({
        title: originalTitle,
        content: originalContent,
        excerpt: originalExcerpt || ''
      })
    }
  }

  async function saveTranslation(locale: string) {
    setSaving(locale)
    try {
      const response = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'article',
          id: articleId,
          locale,
          ...editForm
        })
      })

      if (response.ok) {
        await fetchTranslations()
        setEditingLocale(null)
      }
    } catch (error) {
      console.error('Failed to save translation:', error)
    } finally {
      setSaving(null)
    }
  }

  async function deleteTranslation(locale: string) {
    if (!confirm('Are you sure you want to delete this translation?')) return

    try {
      const response = await fetch(
        `/api/admin/translations?type=article&id=${articleId}&locale=${locale}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        await fetchTranslations()
      }
    } catch (error) {
      console.error('Failed to delete translation:', error)
    }
  }

  const localeInfo = (code: string) => LOCALES.find(l => l.code === code)

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center text-gray-500">
          <Globe className="h-5 w-5 mr-2" />
          Loading translations...
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center">
          <Globe className="h-5 w-5 text-gray-500 mr-2" />
          <span className="font-medium text-gray-900">Translations</span>
          <span className="ml-2 text-sm text-gray-500">
            ({translations.length} of {LOCALES.length - 1} languages)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Original Content Reference */}
          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-blue-900 mb-1">Original (English)</p>
            <p className="text-blue-700 truncate">{originalTitle}</p>
          </div>

          {/* Existing Translations */}
          {translations.map((translation) => {
            const locale = localeInfo(translation.locale)
            const isEditing = editingLocale === translation.locale

            return (
              <div key={translation.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{locale?.flag}</span>
                    <span className="font-medium">{locale?.name}</span>
                  </div>
                  {!isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(translation.locale, translation)}
                        className="text-sm text-subcold-teal hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTranslation(translation.locale)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Excerpt
                      </label>
                      <input
                        type="text"
                        value={editForm.excerpt}
                        onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content (HTML)
                      </label>
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal font-mono text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveTranslation(translation.locale)}
                        disabled={saving === translation.locale}
                        className="flex items-center px-4 py-2 bg-subcold-teal text-white rounded-lg hover:bg-subcold-teal/90 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving === translation.locale ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingLocale(null)}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 truncate">{translation.title}</p>
                )}
              </div>
            )
          })}

          {/* Add New Translation */}
          {getAvailableLocales().length > 0 && !editingLocale && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">Add translation:</p>
              <div className="flex flex-wrap gap-2">
                {getAvailableLocales().map((locale) => (
                  <button
                    key={locale.code}
                    type="button"
                    onClick={() => startEditing(locale.code)}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg mr-2">{locale.flag}</span>
                    <span className="text-sm">{locale.name}</span>
                    <Plus className="h-4 w-4 ml-2 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New Translation Form */}
          {editingLocale && !translations.find(t => t.locale === editingLocale) && (
            <div className="border border-subcold-teal rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-xl mr-2">{localeInfo(editingLocale)?.flag}</span>
                <span className="font-medium">{localeInfo(editingLocale)?.name}</span>
                <span className="ml-2 text-sm text-gray-500">(New)</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt
                  </label>
                  <input
                    type="text"
                    value={editForm.excerpt}
                    onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content (HTML)
                  </label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveTranslation(editingLocale)}
                    disabled={saving === editingLocale}
                    className="flex items-center px-4 py-2 bg-subcold-teal text-white rounded-lg hover:bg-subcold-teal/90 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === editingLocale ? 'Saving...' : 'Save Translation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingLocale(null)}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
