import DataTable from '@/components/DataTable'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const columns: DataTableColumn<TrendingCoin>[] = [
  { 
    header: 'Name',
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item

      return (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link> 
      )
    },
  },
  {
    header: '24h change',
    cellClassName: 'change-cell',
    cell: (coin) => {
      const item = coin.item
      const change24h = item.data.price_change_percentage_24h.usd
      const isTrendingUp = change24h > 0

      return (
        <div className={cn('price-change', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
          <p>
            {isTrendingUp ? (
              <TrendingUp width={16} height={16}/> 
              ) : (
              <TrendingDown width={16} height={16}/> 
            )}
            {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
          </p>
        </div>
      )
    }
  },
  {
    header: 'price', cellClassName: 'price-cell', cell: (coin) => coin.item.data.price
  }
]

const dummyTrendingCoins: TrendingCoin[] = [
  {
    item: {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      market_cap_rank: 1,
      thumb: '/logo.svg',
      large: '/logo.svg',
      data: {
        price: 89113.00,
        price_change_percentage_24h: {
          usd: 2.5
        }
      }
    }
  },
  {
    item: {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      market_cap_rank: 2,
      thumb: '/logo.svg',
      large: '/logo.svg',
      data: {
        price: 2500.00,
        price_change_percentage_24h: {
          usd: -1.2
        }
      }
    }
  }
]

const page = () => {
  return <main className='main-container'>
    <section className='home-grid'>
      <div id="coin-overview">
        <div className="header pt-2">
          <Image
            src='https://assets.coingecko.com/coins/images/1/large/bitcoin.png' 
            alt='Bitcoin' 
            width={56} height={56}
          />
          <div className="info">
            <p>Bitcoin / BTC</p>
            <h1>$89,113.00</h1>
          </div>
        </div>
      </div>

      <p>Trending Coins</p>
      <div id="trending-coins">
        <DataTable 
          data={dummyTrendingCoins} 
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName='trending-coins-table'
        />
      </div>
    </section>

    <section className='w-full mt-7 space-y-4'>
      <p>Categories</p>
    </section>
  </main>
}

export default page