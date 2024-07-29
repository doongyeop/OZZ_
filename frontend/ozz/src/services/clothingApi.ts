'use client'

import axios from 'axios'
import { ClothingData } from '@/types/clothing'

export const createClothing = async (data: FormData) => {
  //TODO: 추후 수정
  try {
    const response = await axios.post('/api/clothing', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // 성공 처리 (예: 알림 표시, 페이지 이동 등)
    return response.data
  } catch (error) {
    // 에러 처리
    console.error('Error creating clothing:', error)
    throw error
  }
}

export const updateClothing = async (id: string, data: FormData) => {
  //TODO: 추후 수정
  const response = await axios.put(`/api/clothing/${id}`, data)
  return response.data
}
