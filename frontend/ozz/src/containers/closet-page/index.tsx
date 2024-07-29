'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchMockClothingList } from '@/services/clothingApi'
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
  const [selectCategory, setSelectCategory] = useState<string>('')

  useEffect(() => {
    // 실제 API 요청을 여기서 수행하여 옷 데이터를 가져옵니다.
    // 예: fetch('/api/clothing').then(res => res.json()).then(data => setClothingItems(data));
    // 지금은 목업 데이터를 사용합니다.
    setClothingList(fetchMockClothingList().content)
  }, [])

  return (
    <>
      {isSidebarOpen ? (
        <CategorySidebar
          onSelectCategory={setSelectCategory}
          onClose={() => setIsSidebarOpen(false)}
        />
      ) : null}
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
    </>
  )
}
