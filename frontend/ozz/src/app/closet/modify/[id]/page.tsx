'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  fetchMockClothing,
  updateClothing,
  deleteClothing,
} from '@/services/clothingApi'
import { Api as ClothesApi } from '@/types/clothes/Api'
import {
  AddClothesPayload,
  ClothesCreateRequest,
} from '@/types/clothes/data-contracts'
import { ClothingData } from '@/types/clothing'
import { getClothingDetails, fetchImage } from '@/services/clothingApi'
import ClothingForm from '@/containers/closet-page/ClothingForm'
import ClothesDeleteButton from '@/components/Button/ClothesDeleteButton'
import ConfirmModal from '@/components/Modal/ConfirmModal'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNiIsImlhdCI6MTcyMzE2MTk1NywiZXhwIjoxNzIzMjIxOTU3fQ.VY4NlD1UxVPhLKbtSxhASn2Y4IeabKJwxSGQ9-AuaK0'

const api = new ClothesApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

export default function ModifyPage({ params }: { params: { id: number } }) {
  const [clothingData, setClothingData] = useState<ClothingData | undefined>(
    undefined,
  )
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      const fetchClothingData = async () => {
        try {
          const data = await getClothingDetails(params.id)
          // 이미지 파일 경로를 처리하는 부분
          if (data.imageFile && data.imageFile.filePath) {
            const imageUrl = await fetchImage(data.imageFile.filePath)
            data.imageFile.filePath = imageUrl
          }
          setClothingData(data)
        } catch (error) {
          console.error('Error fetching clothing data:', error)
        }
      }

      fetchClothingData()
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
