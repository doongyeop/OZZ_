'use client'

import HeroSection from '@/containers/main-page/HeroSection'
import Preview from '@/containers/main-page/Preview'
import { useQuery, useQueries } from '@tanstack/react-query'
import { fetchUserClothes, fetchImage } from '@/services/clothingApi'
import { useState, useEffect } from 'react'

const queryKeys = {
  userClothes: ['userClothes'],
  image: (filePath: string) => ['image', filePath],
}

export default function MainPageContainer() {
  const [closetItems, setClosetItems] = useState<{ image: string }[]>([])

  // 옷 목록을 가져오는 React Query 설정
  const { data: clothesData, isLoading: isClothesLoading } = useQuery({
    queryKey: queryKeys.userClothes,
    queryFn: () =>
      fetchUserClothes({ page: 0, size: 4, sort: ['createdDate,desc'] }, {}),
  })

  // 이미지 가져오기 위한 useQueries 설정
  const imageQueries = useQueries({
    queries: (clothesData?.content || []).map((item) => ({
      queryKey: queryKeys.image(item.imageFile?.filePath || ''),
      queryFn: () => fetchImage(item.imageFile?.filePath || ''),
      enabled: !!item.imageFile?.filePath,
    })),
  })

  // 기본 이미지 설정
  const defaultImageUrl = '/images/mockup/tops11.png'

  // 로딩이 끝났을 때 데이터를 결합하여 상태 업데이트
  useEffect(() => {
    if (!isClothesLoading && imageQueries.every((query) => !query.isLoading)) {
      const items = (clothesData?.content || []).map((item, index) => ({
        image: imageQueries[index]?.data || defaultImageUrl,
      }))
      setClosetItems(items)
    }
  }, [isClothesLoading, imageQueries, clothesData])

  return (
    <>
      <HeroSection />
      <Preview title="옷장" items={closetItems} />
      <Preview title="코디북" items={closetItems} />
    </>
  )
}
