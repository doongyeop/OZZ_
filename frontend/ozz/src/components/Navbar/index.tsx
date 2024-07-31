'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BiCloset, BiSolidUser } from 'react-icons/bi'
import { GiClothes } from 'react-icons/gi'
import { HiHashtag, HiHome } from 'react-icons/hi'

const links = [
  { name: 'Home', href: '/', icon: HiHome },
  { name: 'closet', href: '/closet', icon: BiCloset },
  { name: 'coordi', href: '/coordi', icon: GiClothes },
  { name: 'community', href: '/community', icon: HiHashtag },
  { name: 'mypage', href: '/mypage', icon: BiSolidUser },
]

export default function Navbar() {
  const path = usePathname().split('/')[1]

  if (path.includes('login')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-secondary text-gray-dark py-4">
      <ul className="container mx-auto flex justify-around items-center">
        {links.map((link) => {
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className={
                  path === link.href.split('/')[1] ? 'text-primary-400' : ''
                }
              >
                <link.icon size="32" />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
