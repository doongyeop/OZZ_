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

export const updateClothing = async (id: number, data: FormData) => {
  //TODO: 옷 상세 조회
  const response = await axios.put(`/api/clothes/${id}`, data)
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
  season: ['봄', '가을'],
  size: 'M',
  fit: '레귤러핏',
  texture: ['면', '폴리에스터'],
  color: { name: '검정', code: '#000000' },
  style: ['캐주얼', '데일리'],
  pattern: { name: '무지', img: 'graphic.png' },
  memo: '자주 입는 옷입니다.',
  image: null, // 실제 이미지 파일은 목업 데이터에서 제외
})
