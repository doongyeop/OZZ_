'use client'

import Image from 'next/image'
import { useRef } from 'react'

interface Item {
  image: string
}

const items: Item[] = [
  {
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
  },
  {
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
  },
  {
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
  },
  {
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
  },
  {
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
  },
  {
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
  },
  {
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
  },
  {
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
  },
] // 임시 데이터

export default function HotCoordinations() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToStart = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  const scrollToEnd = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: 'smooth',
      })
    }
  }

  return (
    <>
      <div>
        <h1 className="ms-4 text-2xl font-bold">
          지금 <span className="bg-secondary text-primary-400">핫</span>한 코디
        </h1>
      </div>
      <div className="relative mt-2 h-40">
        <div className="absolute inset-y-0 left-0 z-10 flex items-center">
          <button
            type="button"
            className="p-2 bg-gray-300 bg-opacity-50 hover:bg-opacity-75 rounded-full shadow transition-transform transform hover:scale-125"
            onClick={scrollToStart}
          >
            &lt;
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 z-10 flex items-center">
          <button
            type="button"
            className="p-2 bg-gray-300 bg-opacity-50 hover:bg-opacity-75 rounded-full shadow transition-transform transform hover:scale-125"
            onClick={scrollToEnd}
          >
            &gt;
          </button>
        </div>
        <div ref={scrollRef} className="flex h-40 overflow-x-auto space-x-1">
          {items.map((item, index) => (
            <div
              key={item.image}
              className="flex h-full aspect-[9/16] relative shadow-lg"
            >
              <Image
                src={item.image}
                alt={`hot-${index}`}
                layout="fill"
                objectFit="cover"
                className="w-full h-full rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
