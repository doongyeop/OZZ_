'use client'

import { useRouter } from 'next/navigation'

import ClothingForm from '@/containers/closet-page/ClothingForm'
import { ClothesCreateRequest } from '@/types/clothes/data-contracts'
import { createClothing } from '@/services/clothingApi'

export default function Page() {
  const router = useRouter()

  const handleSubmit = async (
    imageFile: File,
    request: ClothesCreateRequest,
  ) => {
    try {
      const response = await createClothing(imageFile, request)
      console.log('Clothes added successfully', response)
      router.push('/closet')
    } catch (error) {
      console.error('Failed to add clothes', error)
    }
  }

  return (
    <main>
      <ClothingForm onSubmit={handleSubmit} submitButtonText="등록하기" />
    </main>
  )
}
