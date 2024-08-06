'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import Modal from '@/components/Modal'

// 데이터 타입 정의
interface FavoriteGroup {
  group_id: number
  group_name: string
  user_id: number
}

interface Favorite {
  favorite_id: number
  item_name: string
  image_url: string
  group_id: number
}

interface CoordiSet {
  coordi_id: number
  coordi_name: string
  description: string
  image_url: string
  user_id: number
}

// 예제 데이터
const favoriteGroups: FavoriteGroup[] = [
  { group_id: 1, group_name: 'Casual Wear', user_id: 1 },
  { group_id: 2, group_name: 'Formal Wear', user_id: 1 },
  { group_id: 3, group_name: 'Sportswear', user_id: 1 },
  { group_id: 4, group_name: 'Outdoor', user_id: 1 },
]

const favorites: Favorite[] = [
  {
    favorite_id: 1,
    item_name: 'Favorite Item 1',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
    group_id: 1,
  },
  {
    favorite_id: 2,
    item_name: 'Favorite Item 2',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
    group_id: 1,
  },
  {
    favorite_id: 3,
    item_name: 'Favorite Item 3',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
    group_id: 1,
  },
  {
    favorite_id: 4,
    item_name: 'Favorite Item 4',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
    group_id: 2,
  },
  {
    favorite_id: 5,
    item_name: 'Favorite Item 5',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
    group_id: 2,
  },
  {
    favorite_id: 6,
    item_name: 'Favorite Item 6',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
    group_id: 2,
  },
  {
    favorite_id: 7,
    item_name: 'Favorite Item 7',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
    group_id: 2,
  },
  {
    favorite_id: 8,
    item_name: 'Favorite Item 8',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
    group_id: 2,
  },
  // 추가 데이터 생략
]

const coordiSets: CoordiSet[] = [
  {
    coordi_id: 1,
    coordi_name: 'Coordi Set 1',
    description: 'This is a description for Coordi Set 1',
    image_url:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
    user_id: 2,
  },
]

export default function CoordiBook() {
  const [createModal, setCreateModal] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)

  const createCoordiBook = () => {
    setCreateModal(true)
    //코디북 생성 ~~
  }

  const closeModal = () => {
    setCreateModal(false)
  }

  const getFavGrp = (group: FavoriteGroup) => {
    const groupFavorites = favorites.filter(
      (fav) => fav.group_id === group.group_id,
    )

    return (
      <div key={group.group_id} className="aspect-square">
        <Card className="flex items-center h-full overflow-hidden">
          <CardContent
            className={`object-cover p-0 flex flex-wrap ${
              groupFavorites.length >= 4 ? 'w-full h-full' : ''
            }`}
          >
            {groupFavorites.slice(0, 4).map((fav) => (
              <div
                key={fav.favorite_id}
                className={`${
                  groupFavorites.length >= 4
                    ? 'w-1/2 h-1/2 overflow-hidden'
                    : 'h-full w-full'
                }`}
              >
                <img
                  src={fav.image_url}
                  alt={fav.item_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <CardTitle className="text-left text-black font-medium text-sm mt-2">
          {group.group_name}
        </CardTitle>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 m-4">
      <div className="aspect-square">
        <Card
          onClick={createCoordiBook}
          className="h-full bg-secondary flex items-center justify-center"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="max-w-[32px] max-h-[32px]"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44771 3.44772 9 4 9L9 9V4C9 3.44772 9.44772 3 10 3Z"
              className="fill-primary-400"
            />
          </svg>
        </Card>
        <CardTitle className="text-left text-black font-medium text-sm mt-2">
          <span onClick={createCoordiBook}>새 코디북 생성</span>
        </CardTitle>
      </div>
      {favoriteGroups.map((group) => (
        <div key={group.group_id}>{getFavGrp(group)}</div>
      ))}
      {createModal && (
        <Modal title="코디북 이름" onClose={closeModal}>
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="예시) 자주 입는 옷"
                className={`border border-primary-400 bg-secondary p-2 pl-10 w-full focus:outline-none text-right ${
                  inputFocused
                    ? 'text-primary-400'
                    : 'text-primary-400 text-opacity-30'
                }`}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
              >
                <path
                  d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                  className="fill-primary-400"
                />
                <path
                  d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                  className="fill-primary-400"
                />
              </svg>
            </div>
            <button
              onClick={closeModal}
              className="px-3 py-1 mt-4 rounded-full text-sm text-primary-400 border border-primary-400 font-bold hover:text-secondary hover:bg-primary-400"
            >
              만들기
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
