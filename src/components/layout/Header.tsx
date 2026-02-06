import Link from 'next/link'
import Image from 'next/image'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { cookies } from 'next/headers'

export function Header() {
  const cookieStore = cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

  return (
    <header className="bg-subcold-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://subcold.com/cdn/shop/files/subcold-logo-white_39563153-4a05-4674-b976-f96a36b48c2c.png?v=1760517416&width=156"
              alt="Subcold"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
            <span className="ml-2 text-white text-sm font-medium">Support</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <LanguageSwitcher currentLocale={locale} />
          </nav>
        </div>
      </div>
    </header>
  )
}
