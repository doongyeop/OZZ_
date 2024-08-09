'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClothingData } from '@/types/clothing'
import {
  fetchMockClothing,
  updateClothing,
  deleteClothing,
} from '@/services/clothingApi'
import ClothingForm from '@/containers/closet-page/ClothingForm'
import ClothesDeleteButton from '@/components/Button/ClothesDeleteButton'
import ConfirmModal from '@/components/Modal/ConfirmModal'
import { ClothesCreateRequest } from '@/types/clothes/data-contracts'

export default function ModifyPage({ params }: { params: { id: number } }) {
  const [clothingData, setClothingData] = useState<ClothingData | undefined>(
    undefined,
  )
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      const fetchedData = fetchMockClothing(params.id as number)
      setClothingData(fetchedData)
    }
  }, [params.id])

  const handleSubmit = async (
    imageFile: File,
    request: ClothesCreateRequest,
  ) => {
    // try {
    //   await updateClothing(params.id, data)
    //   // 성공 처리
    // } catch (error) {
    //   // 에러 처리
    // }
  }

  const handleDelete = async () => {
    try {
      // await deleteClothing(params.id)
      // 성공 처리 (예: 알림 표시, 페이지 이동 등)
      router.push('/closet') // 목록 페이지로 이동
    } catch (error) {
      // 에러 처리
    }
  }

  return (
    <main>
      <ClothingForm
        initialData={clothingData}
        onSubmit={handleSubmit}
        submitButtonText="수정하기"
      />
      <ClothesDeleteButton onClick={() => setShowConfirmModal(true)} />
      {showConfirmModal && (
        <ConfirmModal
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDelete}
          message="정말 삭제하시겠습니까?"
        />
      )}
    </main>
  )
}
