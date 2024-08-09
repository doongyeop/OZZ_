'use client'

import { useRouter } from 'next/navigation'

import ClothingForm from '@/containers/closet-page/ClothingForm'
import { Api as ClothesApi } from '@/types/clothes/Api'
import {
  AddClothesPayload,
  ClothesCreateRequest,
} from '@/types/clothes/data-contracts'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNCIsImlhdCI6MTcyMzE2Mjg0NywiZXhwIjoxNzIzMjIyODQ3fQ.SmqFRmLOjNlfUMwlQaySKZp5ezkavyoTm2kLyJ62Qxo'
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
    const payload: AddClothesPayload = {
      imageFile,
      request,
    }

    try {
      const response = await api.addClothes(payload)
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
