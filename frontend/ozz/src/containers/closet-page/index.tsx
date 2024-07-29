'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchMockClothingList } from '@/services/clothingApi'

// const mockClothingData: ClothingItem[] = [
//   {
//     id: '1',
//     name: 'SPRAY CARTOON GRAPHIC SS WHITE',
//     purchaseDate: '2024.07.17',
//     imageUrl: '/images/sample-shirt.png', // 이미지 경로를 실제 이미지로 바꿔야 합니다.
//   },
//   // 필요에 따라 더 많은 목업 데이터를 추가합니다.
//   {
//     id: '2',
//     name: 'SPRAY CARTOON GRAPHIC SS WHITE',
//     purchaseDate: '2024.07.17',
//     imageUrl: '/images/sample-shirt.png', // 이미지 경로를 실제 이미지로 바꿔야 합니다.
//   },
//   {
//     id: '3',
//     name: 'SPRAY CARTOON GRAPHIC SS WHITE',
//     purchaseDate: '2024.07.17',
//     imageUrl: '/images/sample-shirt.png', // 이미지 경로를 실제 이미지로 바꿔야 합니다.
//   },
//   {
//     id: '4',
//     name: 'SPRAY CARTOON GRAPHIC SS WHITE',
//     purchaseDate: '2024.07.17',
//     imageUrl: '/images/sample-shirt.png', // 이미지 경로를 실제 이미지로 바꿔야 합니다.
//   },
// ]

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export default function ClosetPageContainer() {
  const [clothingList, setClothingList] = useState<any[]>([])

  useEffect(() => {
    // 실제 API 요청을 여기서 수행하여 옷 데이터를 가져옵니다.
    // 예: fetch('/api/clothing').then(res => res.json()).then(data => setClothingItems(data));
    // 지금은 목업 데이터를 사용합니다.
    setClothingList(fetchMockClothingList().content)
  }, [])

  return (
    <>
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
