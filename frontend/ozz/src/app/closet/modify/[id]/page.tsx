'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Api as ClothesApi } from '@/types/clothes/Api'
import {
  ClothesCreateRequest,
} from '@/types/clothes/data-contracts'
import { ClothingData } from '@/types/clothing'
import { getClothingDetails, fetchImage } from '@/services/clothingApi'
import ClothingForm from '@/containers/closet-page/ClothingForm'
import ClothesDeleteButton from '@/components/Button/ClothesDeleteButton'
import ConfirmModal from '@/components/Modal/ConfirmModal'
import { colors, colorCodeMap, colorMap, colorInvMap } from '@/types/clothing'

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
          // 포맷팅 작업
        const formattedData: ClothingData = {
          id: data.id,
          name: data.name,
          categoryName: data.categoryLow.name, // categoryLow.name을 사용
          brandName: data.brand || null,
          purchaseDate: data.purchaseDate || null,
          purchaseSite: data.purchaseSite || null,
          season: data.seasonList || [],
          size: data.size || null,
          fit: data.fit || null,
          texture: data.textureList || [],
          color: data.colorList ? data.colorList.map((colorCode:string) => {
            // 색상 코드를 기반으로 Color 객체를 찾음
            const colorObj = colors.find(color => color.code === colorCode);
            
            if (colorObj) {
              return colorObj;
            }
            console.warn(`No match found for color code: ${colorCode}`);
            // colorObj가 없으면 기본값으로 빈 Color 객체를 반환하거나 다른 적절한 처리
            return {
              code: colorCode,
              name: colorMap[colorCode], // colorMap에서 이름을 찾음
              colorCode: colorCodeMap[colorCode], // 또는 적절한 기본 색상 코드를 지정
            };
          }) : [],
          style: data.styleList || [],
          pattern: data.patternList || [],
          memo: data.memo || null,
          image: data.imageFile ? await fetchImage(data.imageFile.filePath) : null, // 이미지 파일을 변환
        };

        setClothingData(formattedData);
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
