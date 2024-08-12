'use client'

import { useRouter } from 'next/navigation'

import ClothingForm from '@/containers/closet-page/ClothingForm'
import { Api as ClothesApi } from '@/types/clothes/Api'
import {
  AddClothesPayload,
  ClothesCreateRequest,
} from '@/types/clothes/data-contracts'
import { createClothing } from '@/services/clothingApi'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiMTEiLCJpYXQiOjE3MjM0NTEwMzEsImV4cCI6MTcyMzUxMTAzMX0.gsEfXBzt6vAU77F-k5nN9XJ7tdyGY96Onlp_JpTq0YI'

const api = new ClothesApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

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
