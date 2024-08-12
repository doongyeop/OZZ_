'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Api as ClothesApi } from '@/types/clothes/Api'
import { ClothesUpdateRequest } from '@/types/clothes/data-contracts'
import { ClothingData } from '@/types/clothing'
import { getClothingDetails, updateClothing } from '@/services/clothingApi'
import ClothingForm from '@/containers/closet-page/ClothingForm'
import ClothesDeleteButton from '@/components/Button/ClothesDeleteButton'
import ConfirmModal from '@/components/Modal/ConfirmModal'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiMTEiLCJpYXQiOjE3MjM0NTEwMzEsImV4cCI6MTcyMzUxMTAzMX0.gsEfXBzt6vAU77F-k5nN9XJ7tdyGY96Onlp_JpTq0YI'

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
          const formattedData = await getClothingDetails(params.id)
          setClothingData(formattedData)
        } catch (error) {
          console.error('Error fetching clothing data:', error)
        }
      }

      fetchClothingData()
    }
  }, [params.id])

  const handleSubmit = async (
    imageFile: File,
    request: ClothesUpdateRequest,
  ) => {
    try {
      const response = await updateClothing(params.id, imageFile, request)
      console.log('Clothes added successfully', response)
      router.push('/closet')
    } catch (error) {
      console.error('Failed to add clothes', error)
    }
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
