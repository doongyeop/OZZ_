'use client'

import HeroSection from '@/containers/main-page/HeroSection'
import Preview from '@/containers/main-page/Preview'
import { useQuery } from '@tanstack/react-query'
import { fetchImage, fetchUserClothes } from '@/services/clothingApi'
import { useEffect, useState } from 'react'

const queryKeys = {
  userClothes: ['userClothes'],
  image: (filePath: string) => ['image', filePath],
}

export default function MainPageContainer() {
  const [closetItems, setClosetItems] = useState<
    { id: number; image: string }[]
  >([])

  // 옷 목록을 가져오는 React Query 설정
  const { data: clothesData } = useQuery({
    queryKey: queryKeys.userClothes,
    queryFn: () =>
      fetchUserClothes({ page: 0, size: 4, sort: ['createdDate,desc'] }, {}),
  })

  // useEffect에서 이미지 쿼리 생성 및 실행
  useEffect(() => {
    if (clothesData && clothesData.content) {
      const imageQueries = clothesData.content.map((item) => ({
        queryKey: queryKeys.image(item.imageFile?.filePath || ''),
        queryFn: () => fetchImage(item.imageFile?.filePath || ''),
        enabled: !!item.imageFile?.filePath,
      }))

      const fetchImages = async () => {
        const imageResults = await Promise.all(
          imageQueries.map((query) => query.queryFn()),
        )
        const items = clothesData.content.map((item, index) => ({
          id: item.clothesId,
          image: imageResults[index] || '/images/mockup/tops11.png',
        }))
        setClosetItems(items)
      }

      fetchImages().then()
    }
  }, [clothesData])

  return (
    <>
      <HeroSection />
      <Preview title="옷장" items={closetItems} />
      <Preview title="코디북" items={closetItems} />
    </>
  )
}
