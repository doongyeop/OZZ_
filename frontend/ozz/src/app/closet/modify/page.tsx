'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { ClothingData } from '@/types/clothing'
import { updateClothing } from '@/services/clothingApi'
import { ClothingForm } from '@/containers/closet-page/ClothingForm'

// 목업 데이터 생성 함수
const createMockClothingData = (id: string): ClothingData => {
  return {
    name: `흰색 반팔`,
    brandName: '브랜드 A',
    categoryName: '반팔',
    purchaseDate: '2023-01-01',
    purchaseSite: '온라인 스토어',
    season: ['봄', '가을'],
    size: 'M',
    fit: '레귤러핏',
    texture: ['면', '폴리에스터'],
    color: { name: '검정', code: '#000000' },
    style: ['캐주얼', '데일리'],
    pattern: { name: '무지', img: 'plain.png' },
    memo: '자주 입는 옷입니다.',
    image: null, // 실제 이미지 파일은 목업 데이터에서 제외
  }
}

export default function ModifyPage({ params }: { params: { id: string } }) {
  const [initialData, setInitialData] = useState<ClothingData | null>(null)

  useEffect(() => {
    // 기존 데이터 불러오기
    // setInitialData(fetchedData);
    // 목업 데이터 생성 및 설정
    const mockData = createMockClothingData(params.id)
    setInitialData(mockData)
  }, [params.id])

  const handleSubmit = async (data: FormData) => {
    try {
      await updateClothing(params.id, data)
      // 성공 처리
    } catch (error) {
      // 에러 처리
    }
  }

  if (!initialData) return <div>Loading...</div>
  return (
    <main>
      <Header title="나의 옷짱" />
      <ClothingForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitButtonText="수정하기"
      />
    </main>
  )
}
