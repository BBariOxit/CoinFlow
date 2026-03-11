'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
  const pathname = usePathname()
  return (
    <header>
      <div className="container inner">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="CoinFlow logo" width={30} height={30} />
          <span className="text-white font-semibold text-lg">CoinFlow</span>
        </Link>

        <nav>
          <Link href='/' className={cn('nav-link', {
            'is-active': pathname === '/',
            'is-home': true 
          })}>Home</Link>

          <p>Search model</p>

          <Link href='/coins' className={cn('nav-link', {
            'is-active': pathname === '/coins',
            'is-home': true 
          })}>All coins</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header