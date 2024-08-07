'use client'

import ClothingForm from '@/containers/closet-page/ClothingForm'
import { Api as ClothesApi } from '@/types/clothes/Api'
import { AddClothesPayload } from '@/types/clothes/data-contracts'
import { useRouter } from 'next/navigation'

const api = new ClothesApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiMSIsImlhdCI6MTcyMzAwMzA5NSwiZXhwIjoxNzIzMDYzMDk1fQ.t2baAnDwTltuTZV0Pqjd_1NPKaPUYsB7LLP6D7c5TH4'

export default function Page() {
  const router = useRouter()

  const handleSubmit = async (
    imageFile: File,
    request: AddClothesPayload['request'],
  ) => {
    const formData = new FormData()
    formData.append('imageFile', imageFile)
    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    )

    try {
      const response = await api.addClothes(formData)
      console.log('Clothes added successfully', response)
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
