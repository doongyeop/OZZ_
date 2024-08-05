'use client'

import { useEffect, useState } from 'react'
import { useCategorySidebar } from '@/contexts/CategorySidebarContext'
import CategorySidebar from '@/components/Button/CategorySidebar'
import ClothesRegistButton from '@/components/Button/ClothesRegistButton'
import ClothesList from '@/components/ClothesList'
import SearchArea from '@/containers/closet-page/SearchArea'
import EmptyCloset from '@/containers/closet-page/EmptyCloset/page'
import { fetchMockClothingList } from '@/services/clothingApi'

// interface ClosetPageContainerProps {
//   isSidebarOpen: boolean
//   setIsSidebarOpen: (isOpen: boolean) => void
// }

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export default function ClosetPageContainer() {
  const { isSidebarOpen, selectedSubcategory } = useCategorySidebar()
  const [clothingList, setClothingList] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  // const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
  //   null,
  // )

  useEffect(() => {
    // 실제 API 요청을 여기서 수행하여 옷 데이터를 가져옵니다.
    // 예: fetch('/api/clothing').then(res => res.json()).then(data => setClothingItems(data));
    // 지금은 목업 데이터를 사용합니다.
    const mockData = fetchMockClothingList()
    const allContent = mockData.flatMap((item) => item.content)
    setClothingList(allContent)
  }, [])

  useEffect(() => {
    if (selectedSubcategory) {
      console.log(selectedSubcategory, '로 검색')
      // 여기서 선택된 서브카테고리에 따라 옷 목록을 필터링하는 로직을 구현할 수 있습니다.
    }
  }, [selectedSubcategory])

  // const handleSelectCategory = async (
  //   category: string,
  //   subcategory: string,
  // ) => {
  //   setSelectedCategory(category)
  //   setSelectedSubcategory(subcategory)
  //   isSidebarOpen = false // Close the sidebar after selecting
  //   try {
  //     // const clothes = await fetchFilteredClothes(subcategory);
  //     // setFilteredClothes(clothes);

  //     console.log(subcategory, '로 검색')
  //   } catch (error) {
  //     console.error('Failed to fetch filtered clothes', error)
  //   }
  // }

  return (
    <div>
      {isSidebarOpen && <CategorySidebar />}
      <SearchArea />
      {clothingList.length === 0 ? (
        <EmptyCloset />
      ) : (
        <>
          <ClothesList clothingList={clothingList} isSelectable={false} />
          <ClothesRegistButton />
        </>
      )}
    </div>
  )
}
