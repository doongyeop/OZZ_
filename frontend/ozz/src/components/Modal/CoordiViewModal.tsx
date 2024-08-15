import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'react-icons/hi'
import { getCoordinateList } from '@/services/clothingApi'
import { downloadFile } from '@/services/fileApi'
import { addFavorite } from '@/services/favoriteApi' // addFavorite 함수 import

export default function CoordiViewModal() {
  const [coordinates, setCoordinates] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedCoordinateId, setSelectedCoordinateId] = useState<
    number | null
  >(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchCoordinates(currentPage)
  }, [currentPage])

  const fetchCoordinates = async (page: number) => {
    setLoading(true)

    const condition = {} // 검색 조건이 있다면 추가
    const pageable = {
      page: page - 1, // 0 기반 페이지 인덱스
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

  // 즐겨찾기 추가 함수
  const handleAddFavorite = async (favoriteGroupId: number) => {
    if (selectedCoordinateId === null) return

    try {
      const response = await addFavorite(favoriteGroupId, selectedCoordinateId)
      console.log('즐겨찾기 추가 성공:', response)
      // 추가 성공 후 로직
    } catch (error) {
      console.error('즐겨찾기 추가 중 오류 발생:', error)
    }
  }

  // 페이지 이동 함수
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(coordinates.length / itemsPerPage)),
    )
  }

  return (
    <div className="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-[90%] max-w-[600px] h-[80%] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">코디 보기</h2>
          <button onClick={() => setCurrentPage(1)} className="text-gray-500">
            닫기
          </button>
        </div>

        {/* 로딩 스피너 */}
        {loading ? (
          <div className="flex-grow flex justify-center items-center">
            <p>로딩 중...</p>
          </div>
        ) : (
          // 코디 이미지들
          <div className="flex-grow grid grid-cols-2 gap-2 overflow-y-auto">
            {coordinates.map((coordinate) => (
              <div
                key={coordinate.coordinateId}
                className={`relative w-full h-[200px] bg-gray-200 ${
                  selectedCoordinateId === coordinate.coordinateId
                    ? 'border-2 border-primary-400'
                    : ''
                }`}
                onClick={() => setSelectedCoordinateId(coordinate.coordinateId)}
              >
                {/* 다운로드된 이미지 표시 */}
                <img
                  src={coordinate.imageUrl}
                  alt="coordinate"
                  className="object-cover w-full h-full"
                  style={{ aspectRatio: '9 / 16' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* 즐겨찾기 추가 버튼 */}
        {selectedCoordinateId !== null && (
          <div className="mt-4 flex justify-center">
            <button
              className="px-4 py-2 bg-primary-400 text-white rounded-lg"
              onClick={() => handleAddFavorite(1)} // favoriteGroupId는 예시로 1을 넣었습니다.
            >
              즐겨찾기 추가
            </button>
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="mt-4 flex items-center justify-center space-x-4">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">
            {currentPage} / {Math.ceil(coordinates.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(coordinates.length / itemsPerPage)
            }
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
