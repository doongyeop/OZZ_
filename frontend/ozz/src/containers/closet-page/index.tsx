'use client'

import CategorySidebar from '@/components/Button/CategorySidebar'
import ClothesRegistButton from '@/components/Button/ClothesRegistButton'
import ClothesList from '@/components/ClothesList'
import SearchArea from '@/containers/closet-page/SearchArea'
import { fetchMockClothingList } from '@/services/clothingApi'
import { useEffect, useState } from 'react'

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  )

  useEffect(() => {
    // 실제 API 요청을 여기서 수행하여 옷 데이터를 가져옵니다.
    // 예: fetch('/api/clothing').then(res => res.json()).then(data => setClothingItems(data));
    // 지금은 목업 데이터를 사용합니다.
    const mockData = fetchMockClothingList()
    const allContent = mockData.flatMap((item) => item.content)
    setClothingList(allContent)
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
      <ClothesList clothingList={clothingList} isSelectable={false} />
      <ClothesRegistButton />
    </div>
  )
}
