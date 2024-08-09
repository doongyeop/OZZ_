'use client'

import axios from 'axios'
import { Api as ClothesApi } from '@/types/clothes/Api'
import { Api as FileApi } from '@/types/file/Api'
import { ClothingData } from '@/types/clothing'
import {
  ClothesSearchCondition,
  GetClothesOfUserData,
  Pageable,
} from '@/types/clothes/data-contracts'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNiIsImlhdCI6MTcyMzE2MTk1NywiZXhwIjoxNzIzMjIxOTU3fQ.VY4NlD1UxVPhLKbtSxhASn2Y4IeabKJwxSGQ9-AuaK0'

const clothesApi = new ClothesApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

const fileApi = new FileApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

export async function fetchUserClothes(
  pageable: Pageable,
  searchCondition: ClothesSearchCondition = {},
): Promise<GetClothesOfUserData> {
  const response = await clothesApi.getClothesOfUser({
    condition: searchCondition,
    pageable,
  })
  return response.json()
}

export async function fetchImage(filePath: string): Promise<string> {
  const response = await fileApi.downloadFile(filePath)
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export const createClothing = async (data: FormData) => {
  // TODO: 추후 수정
  try {
    const response = await axios.post('/api/clothing', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    // 에러 처리
    throw error
  }
}

export async function getClothingDetails(clothesId: number) {
  const response = await clothesApi.getClothes(clothesId)
  return response.json()
}

export const updateClothing = async (id: number, data: FormData) => {
  // TODO: 옷 상세 조회
  const response = await axios.put(`/api/clothes/${id}`, data)
  return response.data
}

export const deleteClothing = async (id: number) => {
  const response = await axios.delete(`/api/clothes/${id}`)
  return response.data
}

export const fetchMockClothingList = () => [
  {
    size: 2,
    content: [
      {
        clothesId: 1,
        name: 'SPRAY CARTOON GRAPHIC SS WHITE',
        createdDate: '2024-07-27T01:14:35.702Z',
        categoryLow: {
          categoryLowId: '1',
          name: '반팔',
        },
        imageFile: {
          fileId: 1,
          filePath: '/images/sample-shirt.png', // 실제 이미지 파일 경로로 대체
          fileName: 'sample-shirt.png',
          fileType: 'image/png',
        },
      },
      {
        clothesId: 2,
        name: '기본 반팔티',
        createdDate: '2024-07-30T01:14:35.702Z',
        categoryLow: {
          categoryLowId: '1',
          name: '반팔',
        },
        imageFile: {
          fileId: 1,
          filePath: '/images/mockup/tops02.png', // 실제 이미지 파일 경로로 대체
          fileName: 'sample-shirt.png',
          fileType: 'image/png',
        },
      },
    ],
    number: 0,
    sort: {
      empty: true,
      sorted: true,
      unsorted: true,
    },
    pageable: {
      offset: 0,
      sort: {
        empty: true,
        sorted: true,
        unsorted: true,
      },
      paged: true,
      pageNumber: 0,
      pageSize: 1,
      unpaged: true,
    },
    first: true,
    last: true,
    numberOfElements: 1,
    empty: false,
  },
]

export const fetchMockClothing = (id: number): ClothingData => ({
  id,
  name: `SPRAY CARTOON GRAPHIC SS WHITE`,
  brandName: '팀코믹스',
  categoryName: '상의 > 반팔',
  purchaseDate: '2023-01-01',
  purchaseSite: '온라인 스토어',
  season: ['SPRING', 'AUTUMN'],
  size: 'M',
  fit: 'REGULAR_FIT',
  texture: ['COTTON', 'SYNTHETIC_POLYESTER'],
  color: [],
  style: ['CASUAL', 'STREET'],
  pattern: ['SOLID'],
  memo: '자주 입는 옷입니다.',
  image: null, // 실제 이미지 파일은 목업 데이터에서 제외
})
