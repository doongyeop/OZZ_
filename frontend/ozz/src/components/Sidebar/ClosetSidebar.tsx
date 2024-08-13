'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useInfiniteQuery, useQueries } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

import {
  ClothingData,
  categoryMap,
  categoryNameToLowIdMap,
} from '@/types/clothing'
import { ClothesBasicWithFileResponse } from '@/types/clothes/data-contracts'
import { fetchImage, fetchUserClothes } from '@/services/clothingApi'
import CategoryModal from '../Modal/CategoryModal'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import styles from '@/styles/ClosetSidebar.module.css'

type ClosetSidebarProps = {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
  category: string | null
  onCategoryChange: (category: string | null) => void
  onSelectItem: (
    item: ClothesBasicWithFileResponse & { imageUrl: string },
  ) => void
}

const queryKeys = {
  userClothes: 'userClothes',
}

export default function ClosetSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  category,
  onCategoryChange,
  onSelectItem,
}: ClosetSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category,
  )
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    string | undefined
  >(undefined)
  const [clothingItems, setClothingItems] = useState<ClothingData[]>([])
  const observerElem = useRef(null)

  // 카테고리 이름을 ID로 변환
  const categoryHighId =
    selectedCategory && selectedCategory
      ? categoryMap[selectedCategory]?.id
      : ''
  const categoryLowId =
    selectedSubcategory && selectedSubcategory !== '전체'
      ? categoryNameToLowIdMap[selectedSubcategory]
      : ''

  useEffect(() => {
    setIsSidebarOpen(isSidebarOpen)
  }, [isSidebarOpen, setIsSidebarOpen])

  const handleCategoryChange = (newCategory: string) => {
    // 카테고리 필터링
    console.log('newCategory ', newCategory)
    onCategoryChange(newCategory)
    setSelectedCategory(newCategory)
    setIsModalOpen(false)
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [queryKeys.userClothes, selectedCategory, selectedSubcategory],
      queryFn: ({ pageParam = 0 }) => {
        return fetchUserClothes(
          { page: pageParam, size: 20, sort: ['createdDate,desc'] },
          {
            categoryHighId,
            categoryLowId,
            keyword: '',
          },
        )
      },
      getNextPageParam: (lastPage) =>
        lastPage.last ? undefined : lastPage.number + 1,
      initialPageParam: 0,
    })

  // Flatten the pages into a single list
  const clothingList = data?.pages.flatMap((page) => page.content) || []

  useEffect(() => {
    const currentElem = observerElem.current

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          await fetchNextPage()
        }
      },
      { threshold: 1.0 },
    )

    if (currentElem) {
      observer.observe(currentElem)
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem)
      }
    }
  }, [hasNextPage, fetchNextPage])

  // Fetch images for each clothing item
  const imageQueries = clothingList.map((item) => ({
    queryKey: ['image', item.imageFile?.filePath],
    queryFn: () => fetchImage(item.imageFile?.filePath || ''),
    enabled: !!item.imageFile?.filePath,
  }))

  const imageResults = useQueries({ queries: imageQueries })

  const defaultImageUrl = '/images/mockup/tops11.png'

  const clothingWithImages = clothingList.map((item, index) => ({
    ...item,
    imageUrl: imageResults[index]?.data || defaultImageUrl,
  }))

  // TODO : 카테고리 필터링 기능 구현

  return (
    <>
      <div
        className={`${styles.sidebarGroup} ${isSidebarOpen ? styles.open : ''}`}
      >
        <button
          type="button"
          aria-label="사이드바 접고 펴기"
          className={`${isSidebarOpen ? styles.toggleButtonOpen : styles.toggleButtonClose} flex justify-center`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h3>내 옷짱에서 가져오기</h3>
            <button
              type="button"
              aria-label="사이드바 닫기"
              onClick={() => setIsModalOpen(true)}
              className="flex justify-center items-center px-2 py-0.5 m-1 rounded-lg border-2 border-primary-400 text-primary-400 text-sm"
            >
              {category} <FaChevronDown className="ml-2" />
            </button>
          </div>
          <div className={styles.clothesList}>
            {clothingWithImages.map((item) => (
              <button
                type="button"
                aria-label="옷 등록"
                key={item.clothesId}
                className={styles.clothItem}
                onClick={() => onSelectItem(item)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name ?? 'No name'}
                  width={80}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CategoryModal
          onClose={() => setIsModalOpen(false)}
          setValue={handleCategoryChange}
        />
      )}
    </>
  )
}
