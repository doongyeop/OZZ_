'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import HeaderWithBackward from '@/components/HeaderWithBackward'
import TagButton from '@/components/Button/TagButton'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover'
import { IoIosArrowDown } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import { FavoriteDetail } from '@/types/coordibook'
import { styleMap, styleInvMap, Style } from '@/types/clothing'
import { getFavoritesByGroup, deleteFavorite1 } from '@/services/favoriteApi'
import Modal from '@/components/Modal'

interface CoordiBookDetailPageProps {
  params: { id: number }
}

export default function CoordiBookDetailPage({
  params,
}: CoordiBookDetailPageProps) {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || '코디북 이름'

  const styleTags = [
    '전체',
    '스트릿',
    '캐주얼',
    '스포티',
    '포멀',
    '로맨틱',
    '엘레강스',
    '매니시',
    '모던',
    '내추럴',
    '에스닉',
  ]

  const [selectedTags, setSelectedTags] = useState<string[]>(['전체'])
  const [favGrpDetails, setFavGrpDetails] = useState<FavoriteDetail[]>([])
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedCoordiId, setSelectedCoordiId] = useState<number | null>(null)
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag],
    )
  }

  const filteredItems = selectedTags.includes('전체')
    ? favGrpDetails
    : favGrpDetails.filter((item) =>
        item.coordinate.styleList.some((style: Style) =>
          selectedTags.some(
            (tag) => styleInvMap[style] === tag || style === styleMap[tag],
          ),
        ),
      )

  const fetchCoordiBook = async (groupId: number) => {
    const response = await getFavoritesByGroup(groupId)
    setFavGrpDetails(response)
  }

  useEffect(() => {
    fetchCoordiBook(params.id)
  }, [params.id])

  const handleMouseDown = (coordiId: number) => {
    longPressTimeout.current = setTimeout(() => {
      setSelectedCoordiId(coordiId)
      setDeleteModal(true)
    }, 500) // 0.5초 이상 클릭 시 롱프레스 발생
  }

  const handleMouseUpOrLeave = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
  }

  const deleteCoordi = async () => {
    if (selectedCoordiId === null) return

    try {
      const response = await deleteFavorite1(params.id, selectedCoordiId)
      console.log('코디 삭제 결과:', response)
      if (response.status === 204) {
        console.log('코디 삭제 성공')
        setDeleteModal(false)
        setSelectedCoordiId(null)
        fetchCoordiBook(params.id)
      }
    } catch (err) {
      console.log('코디 삭제 중 문제 발생:', err)
    }
  }

  return (
    <div>
      <HeaderWithBackward title="코디북" />
      <div className="m-4">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">{name}</h1>
          <div className="flex justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex gap-1 items-center bg-gray-light hover:bg-gray-medium border border-gray-dark rounded-lg px-3"
                >
                  스타일 태그
                  <IoIosArrowDown />
                </button>
              </PopoverTrigger>
              <PopoverContent className="me-4 bg-gray-light">
                <div className="flex flex-wrap gap-2">
                  {styleTags.map((tag) => (
                    <TagButton
                      key={tag}
                      isSelected={selectedTags.includes(tag)}
                      onClick={() => handleTagClick(tag)}
                    >
                      #{tag}
                    </TagButton>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="my-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <TagButton key={tag} isSelected onClick={() => handleTagClick(tag)}>
              #{tag}
            </TagButton>
          ))}
        </div>
        <div>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {filteredItems.map((item, index) => (
                <div
                  key={item.favoriteId}
                  role="button" // 버튼 역할을 명시
                  tabIndex={0} // 키보드 포커스를 받을 수 있게 설정
                  onMouseDown={() =>
                    handleMouseDown(item.coordinate.coordinateId)
                  }
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleMouseDown(item.coordinate.coordinateId)
                    }
                  }}
                >
                  <Link href={`/coordi/detail/${item.coordinate.coordinateId}`}>
                    <Image
                      src={item.coordinate.imageFile.filePath}
                      alt={`item ${index + 1}`}
                      width={0}
                      height={0}
                      sizes="100%"
                      className="w-full h-auto"
                    />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center">
              <RxCross2 size="90" className="text-gray-dark" />
              <div className="text-center font-semibold">
                <p>스타일이 일치하는 코디가 없어요</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {deleteModal && (
        <Modal
          onClose={() => setDeleteModal(false)}
          title="이 코디를 삭제하시겠습니까?"
        >
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setDeleteModal(false)}
              className="border border-primary-400 rounded-full hover:bg-primary-400 hover:text-secondary px-4 py-1"
            >
              아니오
            </button>
            <button
              type="button"
              onClick={deleteCoordi}
              className="border border-primary-400 rounded-full hover:bg-primary-400 hover:text-secondary px-4 py-1"
            >
              네
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
