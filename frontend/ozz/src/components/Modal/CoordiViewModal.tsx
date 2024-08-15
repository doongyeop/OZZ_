'use client'

import React, { useState, useEffect } from 'react'
import { HiChevronLeft, HiChevronRight, HiX } from 'react-icons/hi'
import Image from 'next/image'
import { getCoordinateList } from '@/services/clothingApi'
import { downloadFile } from '@/services/fileApi'
import { addFavorite } from '@/services/favoriteApi'

interface CoordiViewModalProps {
  onClose: () => void
  favoriteGroupId: number
}

export default function CoordiViewModal({
  onClose,
  favoriteGroupId,
}: CoordiViewModalProps) {
  const [coordinates, setCoordinates] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedCoordinateId, setSelectedCoordinateId] = useState<
    number | null
  >(null)
  const itemsPerPage = 10

  const fetchCoordinates = async (page: number) => {
    setLoading(true)

    const condition = {}
    const pageable = {
      page: page - 1,
      size: itemsPerPage,
    }

    try {
      const response = await getCoordinateList(condition, pageable)
      const coordinatesWithImages = await Promise.all(
        response.content.map(async (coordinate: any) => {
          const file = await downloadFile(coordinate.imageFile.filePath)
          const imageUrl = file ? URL.createObjectURL(file) : ''
          return { ...coordinate, imageUrl }
        }),
      )
      setCoordinates(coordinatesWithImages)
    } catch (error) {
      console.error('Error fetching coordinates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoordinates(currentPage)
  }, [currentPage])

  const handleAddFavorite = async () => {
    if (selectedCoordinateId === null) return

    try {
      await addFavorite(favoriteGroupId, selectedCoordinateId)
    } catch (error) {
      console.error('즐겨찾기 추가 중 오류 발생:', error)
    }
  }

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(coordinates.length / itemsPerPage)),
    )
  }

  return (
    <div className="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary rounded-lg w-[90%] max-w-[600px] h-[80%] flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primary-400">코디 보기</h2>
          <button
            onClick={onClose}
            className="text-primary-400"
            type="button"
            aria-label="닫기"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex-grow flex justify-center items-center text-primary-400">
            <p>로딩 중...</p>
          </div>
        ) : (
          <div className="flex-grow grid grid-cols-2 gap-2 overflow-y-auto">
            {coordinates.map((coordinate) => (
              <div
                key={coordinate.coordinateId}
                className={`relative w-full bg-secondary ${
                  selectedCoordinateId === coordinate.coordinateId
                    ? 'border border-primary-400'
                    : ''
                }`}
                onClick={() => setSelectedCoordinateId(coordinate.coordinateId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedCoordinateId(coordinate.coordinateId)
                  }
                }}
                role="button"
                tabIndex={0}
                style={{
                  aspectRatio: '9 / 16', // 9:16 비율 유지
                }}
              >
                <Image
                  src={coordinate.imageUrl || '/placeholder.png'}
                  alt="coordinate"
                  layout="fill"
                  style={{ objectFit: 'cover' }} // 이미지를 부모 요소에 맞게 채우되 비율 유지
                />
              </div>
            ))}
          </div>
        )}

        {selectedCoordinateId !== null && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="px-4 py-2 bg-primary-400 text-secondary rounded-lg"
              onClick={handleAddFavorite}
            >
              코디북에 추가
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center space-x-4 text-primary-400">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            type="button"
            aria-label="이전 페이지"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            {currentPage} / {Math.ceil(coordinates.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(coordinates.length / itemsPerPage)
            }
            type="button"
            aria-label="다음 페이지"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
