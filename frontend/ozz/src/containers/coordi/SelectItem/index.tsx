'use client'

import ClothesList from '@/components/ClothesList'
import { useSelectedItem } from '@/contexts/SelectedItemContext'
import { fetchMockClothingList } from '@/services/clothingApi'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SelectItemContainer() {
  const [clothingList, setClothingList] = useState<any[]>([])
  const { selectedItem } = useSelectedItem()
  const router = useRouter()

  useEffect(() => {
    // 실제 API 요청을 여기서 수행하여 옷 데이터를 가져옵니다.
    // 예: fetch('/api/clothing').then(res => res.json()).then(data => setClothingItems(data));
    // 지금은 목업 데이터를 사용합니다.
    const mockData = fetchMockClothingList()
    const allContent = mockData.flatMap((item) => item.content)
    setClothingList(allContent)
  }, [])

  const handleComplete = () => {
    if (selectedItem) {
      router.push('/coordi')
    }
  }

  return (
    <>
      <div className="m-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">필수 아이템 고르기</h1>
          <p className="text-xs text-secondary">
            코디에 꼭 필요한 아이템 하나를 선택해 주세요!
          </p>
        </div>
        <button
          type="button"
          className={`rounded-lg px-3 py-1 ${
            selectedItem
              ? 'bg-secondary text-primary-400'
              : 'border border-gray-dark text-gray-dark'
          }`}
          onClick={handleComplete}
        >
          완료
        </button>
      </div>
      <ClothesList clothingList={clothingList} isSelectable />
    </>
  )
}
