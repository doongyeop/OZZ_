'use client'

import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { type CarouselApi } from '@/components/ui/carousel'
import { useEffect, useRef, useState } from 'react'

export default function HeroSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const recommends = [
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

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  // 오늘 날짜 포맷
  const today = new Date()
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`

  return (
    <>
      {recommends ? (
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="pt-4 px-4 flex justify-center "
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {recommends.map((recommend, index) => (
              <CarouselItem key={index}>
                <Card className="aspect-square overflow-hidden rounded-lg shadow-md">
                  <img
                    src={recommend.image}
                    alt={`recommendation-${index}`}
                    className="w-full h-full object-cover"
                  />
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-12 text-white text-center">
            <p className="text-2xl font-medium">{formattedDate}</p>
            <p className="text-4xl font-extrabold">오늘의 추천 코디</p>
          </div>
          <div className="absolute bottom-2 right-6 bg-secondary bg-opacity-50 rounded-full px-3 py-0.5 text-white text-sm">
            {current} / {count}
          </div>
        </Carousel>
      ) : (
        <div className="flex flex-col justify-center items-center h-96 bg-secondary text-gray-light">
          <img className="w-28" src="/images/logo_blank_green.png" alt="ozz" />
          <h1 className="text-xl font-bold mt-2">OZZ : 옷짱</h1>
          <p className="text-center mt-8">
            옷장에 옷을 등록하면 <br />
            AI가 오늘 날씨에 맞는 옷을 추천해 줄 거예요!
          </p>
        </div>
      )}
    </>
  )
}
