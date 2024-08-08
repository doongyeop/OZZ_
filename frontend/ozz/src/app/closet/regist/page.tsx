'use client'

import { useRouter } from 'next/navigation'
import axios from 'axios'

import ClothingForm from '@/containers/closet-page/ClothingForm'
import { Api as ClothesApi } from '@/types/clothes/Api'
import {
  AddClothesPayload,
  ClothesCreateRequest,
} from '@/types/clothes/data-contracts'

const api = new ClothesApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

const token = ''
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

    const formData = new FormData()
    formData.append('imageFile', imageFile)
    formData.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    )

    console.log('FormData content:')
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1])
    }

    console.log(request)

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }

    try {
      // const response = await api.addClothes(formData)
      const response = await fetch(
        'http://i11a804.p.ssafy.io:8000/api/clothes',
        requestOptions,
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Clothes added successfully', data)
      // console.log('Clothes added successfully', response)
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
