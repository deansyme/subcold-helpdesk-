'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RotateCcw,
  FormInput,
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Articles', href: '/admin/articles', icon: FileText },
  { name: 'Returns', href: '/admin/returns', icon: RotateCcw },
  { name: 'Return Form', href: '/admin/return-form', icon: FormInput },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-800">
        <Image
          src="https://subcold.com/cdn/shop/files/subcold-logo-white_39563153-4a05-4674-b976-f96a36b48c2c.png?v=1760517416&width=156"
          alt="Subcold"
          width={100}
          height={28}
          className="h-7 w-auto"
        />
        <span className="ml-2 text-white text-xs font-medium bg-subcold-teal px-2 py-0.5 rounded">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-subcold-teal text-white'
                  : 'text-gray-400 hover:bg-subcold-gray hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4 mr-3" />
          View Live Site
        </Link>
        <div className="mt-4 px-3">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="text-sm text-white truncate">{session?.user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="mt-3 flex items-center w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-subcold-black border-b border-gray-800 px-4 h-16 flex items-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <Image
          src="https://subcold.com/cdn/shop/files/subcold-logo-white_39563153-4a05-4674-b976-f96a36b48c2c.png?v=1760517416&width=156"
          alt="Subcold"
          width={100}
          height={28}
          className="h-6 w-auto ml-4"
        />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="fixed inset-y-0 left-0 w-64 bg-subcold-black flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-subcold-black">
        <SidebarContent />
      </div>
    </>
  )
}
