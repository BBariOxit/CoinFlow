'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
  const pathname = usePathname()
  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image src="/public/logo.svg" alt="CoinFlow logo" width={132} height={40} />
        </Link>

        <nav>
          <Link href='/' className={cn('nav-link', {
            'is-active': pathname === '/',
            'is-home': true 
          })}>Home</Link>
          <p>Search model</p>
          <Link href='/coins'>All coins</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header