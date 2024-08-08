'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import styles from '@/styles/ClosetSidebar.module.css'
import CategoryModal from '@/app/@modal/category/page'

type ClothingItem = {
  id: string
  name: string
  createdDate: string
  imageFile: {
    fileId: number
    filePath: string
    fileName: string
    fileType: string
  }
  categoryHigh: {
    categoryHighId: number
    name: string
  }
  categoryLow: {
    categoryLowId: number
    name: string
  }
}

type ClosetSidebarProps = {
  isSidebarOpen: boolean
  category: string | null
  onSelectItem: (item: ClothingItem) => void
  onCategoryChange: (category: string | null) => void
}

export default function ClosetSidebar({
  isSidebarOpen,
  category,
  onSelectItem,
  onCategoryChange,
}: ClosetSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category,
  )
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([])

  const handleCategoryChange = (newCategory: string) => {
    onCategoryChange(newCategory)
    setIsModalOpen(false)
  }

  useEffect(() => {
    setSelectedCategory(category)
    // 실제 API 호출을 대신하여 목업 데이터로 대체
    const filteredItems = dummyClothes.filter(
      (item) => item.categoryLow.name === category,
    )
    setClothingItems(filteredItems)
    setIsOpen(isSidebarOpen)
  }, [category, isSidebarOpen])

  // TODO : 사용자의 옷장 목록 가져오기 API 구현
  // TODO : 카테고리 필터링 기능 구현
  const dummyClothes: ClothingItem[] = [
    {
      id: '1',
      name: 'Basic White T-shirt',
      createdDate: '2023-05-15T10:30:00Z',
      imageFile: {
        fileId: 7,
        filePath: '/images/mockup/tops01.png',
        fileName: '상의.png',
        fileType: 'image/png',
      },
      categoryHigh: {
        categoryHighId: 1,
        name: '상의',
      },
      categoryLow: {
        categoryLowId: 1,
        name: '셔츠',
      },
    },
    {
      id: '2',
      name: 'Blue Jeans',
      createdDate: '2023-06-20T12:00:00Z',
      imageFile: {
        fileId: 8,
        filePath: '/images/mockup/pants01.png',
        fileName: '하의.png',
        fileType: 'image/png',
      },
      categoryHigh: {
        categoryHighId: 2,
        name: '하의',
      },
      categoryLow: {
        categoryLowId: 2,
        name: '청바지',
      },
    },
    {
      id: '3',
      name: 'Winter Jacket',
      createdDate: '2022-12-01T09:00:00Z',
      imageFile: {
        fileId: 9,
        filePath: '/images/mockup/outer01.png',
        fileName: '아우터.png',
        fileType: 'image/png',
      },
      categoryHigh: {
        categoryHighId: 3,
        name: '아우터',
      },
      categoryLow: {
        categoryLowId: 3,
        name: '자켓',
      },
    },
    {
      id: '4',
      name: 'Summer Hat',
      createdDate: '2023-07-10T14:30:00Z',
      imageFile: {
        fileId: 10,
        filePath: '/images/mockup/accessory01.png',
        fileName: '액세서리.png',
        fileType: 'image/png',
      },
      categoryHigh: {
        categoryHighId: 4,
        name: '액세서리',
      },
      categoryLow: {
        categoryLowId: 4,
        name: '모자',
      },
    },
    {
      id: '5',
      name: 'Leather Bag',
      createdDate: '2023-03-05T11:00:00Z',
      imageFile: {
        fileId: 11,
        filePath: '/images/mockup/bag01.png',
        fileName: '가방.png',
        fileType: 'image/png',
      },
      categoryHigh: {
        categoryHighId: 5,
        name: '가방',
      },
      categoryLow: {
        categoryLowId: 5,
        name: '가방',
      },
    },
  ]

  return (
    <>
      <div className={`${styles.sidebarGroup} ${isOpen ? styles.open : ''}`}>
        <button
          className={`${isOpen ? styles.toggleButtonOpen : styles.toggleButtonClose} flex justify-center`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h3>내 옷짱에서 가져오기</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex justify-center items-center px-2 py-0.5 m-1 rounded-lg border-2 border-primary-400 text-primary-400 text-sm"
            >
              {category} <FaChevronDown className="ml-2" />
            </button>
          </div>
          <div className={styles.clothesList}>
            {dummyClothes.map((item) => (
              <div
                key={item.id}
                className={styles.clothItem}
                onClick={() => onSelectItem(item)}
              >
                <Image
                  src={item.imageFile.filePath}
                  alt={item.name}
                  width={80}
                  height={80}
                />
              </div>
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
