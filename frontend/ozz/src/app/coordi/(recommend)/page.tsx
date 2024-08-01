'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Weather from '@/containers/coordi/Weather'
import SelectOptions from '@/containers/coordi/SelectOptions'
import CoordiOfTheDay from '@/containers/coordi/CoordiOfTheDay'

export default function CoordiRecommendPage() {
  const today = format(new Date(), 'M월 d일', { locale: ko })
  const [selectedDate, setSelectedDate] = useState<string>(today)

  const coordinations = [
    {
      id: '0',
      image:
        'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
    },
    {
      id: '1',
      image:
        'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
    },
    {
      id: '2',
      image:
        'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
    },
    {
      id: '3',
      image:
        'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
    },
  ] // 임시 데이터

  useEffect(() => {
    setSelectedDate(today)
  }, [today])

  return (
    <>
      <Weather setSelectedDate={setSelectedDate} />
      <SelectOptions />
      <CoordiOfTheDay
        selectedDate={selectedDate}
        coordinations={coordinations}
      />
    </>
  )
}
