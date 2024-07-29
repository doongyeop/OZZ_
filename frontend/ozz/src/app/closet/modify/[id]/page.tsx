'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { ClothingData } from '@/types/clothing'
import { fetchMockClothing, updateClothing } from '@/services/clothingApi'
import { ClothingForm } from '@/containers/closet-page/ClothingForm'

export default function ModifyPage({ params }: { params: { id: number } }) {
  const [initialData, setInitialData] = useState<ClothingData | null>(null)
  const [clothingData, setClothingData] = useState<ClothingData | undefined>(
    undefined,
  )

  useEffect(() => {
    if (params.id) {
      const fetchedData = fetchMockClothing(params.id as number)
      setClothingData(fetchedData)
    }
  }, [params.id])

  const handleSubmit = async (data: FormData) => {
    try {
      await updateClothing(params.id, data)
      // 성공 처리
    } catch (error) {
      // 에러 처리
    }
  }

  return (
    <main>
      <Header title="나의 옷짱" />
      <ClothingForm
        initialData={clothingData}
        onSubmit={handleSubmit}
        submitButtonText="수정하기"
      />
    </main>
  )
}
