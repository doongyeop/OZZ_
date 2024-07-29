'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchMockClothingList } from '@/services/clothingApi'
import SearchArea from '@/containers/closet-page/SearchArea'
import CategorySidebar from '@/components/Button/CategorySidebar'

interface ClosetPageContainerProps {
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export default function ClosetPageContainer({
  isSidebarOpen,
  setIsSidebarOpen,
}: ClosetPageContainerProps) {
  const [clothingList, setClothingList] = useState<any[]>([])
  const [filteredClothes, setFilteredClothes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  )

  useEffect(() => {
    // 실제 API 요청을 여기서 수행하여 옷 데이터를 가져옵니다.
    // 예: fetch('/api/clothing').then(res => res.json()).then(data => setClothingItems(data));
    // 지금은 목업 데이터를 사용합니다.
    setClothingList(fetchMockClothingList().content)
  }, [])

  const handleSelectCategory = async (
    category: string,
    subcategory: string,
  ) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    isSidebarOpen = false // Close the sidebar after selecting
    try {
      // const clothes = await fetchFilteredClothes(subcategory);
      // setFilteredClothes(clothes);

      console.log(subcategory, '로 검색')
    } catch (error) {
      console.error('Failed to fetch filtered clothes', error)
    }
  }

  return (
    <div>
      {isSidebarOpen ? (
        <CategorySidebar
          onSelectCategory={handleSelectCategory}
          onClose={() => setIsSidebarOpen(false)}
        />
      ) : null}
      <SearchArea />
      <div className="flex flex-col justify-start items-center h-96">
        {clothingList.map((item) => (
          <Link
            key={item.clothesId}
            href={`/closet/modify/${item.clothesId}`}
            passHref
          >
            <div className="flex items-center mb-4 mt-4 cursor-pointer">
              <Image
                src={item.imageFile.filePath}
                alt={item.name}
                width={50}
                height={50}
                className="mr-4"
              />
              <div>
                <div className="text-sm text-gray-500">
                  {formatDate(item.createdDate)}
                </div>
                <div className="text-lg font-semibold">{item.name}</div>
              </div>
            </div>
            <hr />
          </Link>
        ))}
      </div>
    </div>
  )
}
