'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/FittingPage.module.css'
import { ClothingData } from '@/types/clothing'
import SaveCoordiButton from '@/components/Button/SaveCoordiButton'
import ShareCommunityButton from '@/components/Button/ShareCommunityButton'

type ClothingItem = {
  type: 'accessory' | 'onepiece' | 'top' | 'outer' | 'bottom' | 'shoes' | 'bag'
  image: string | null
}

const placeholderImages = {
  accessory: '/images/fitting/accessory.png',
  onepiece: '/images/fitting/onepiece.png',
  top: '/images/fitting/top.png',
  outer: '/images/fitting/outer.png',
  bottom: '/images/fitting/bottom.png',
  shoes: '/images/fitting/shoes.png',
  bag: '/images/fitting/bag.png',
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export default function FittingContainer() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([
    { type: 'accessory', image: null },
    { type: 'onepiece', image: null },
    { type: 'top', image: null },
    { type: 'outer', image: null },
    { type: 'bottom', image: null },
    { type: 'shoes', image: null },
    { type: 'bag', image: null },
  ])
  const [outfit, setOutfit] = useState<{
    outer: ClothingData | null
    top: ClothingData | null
    bottom: ClothingData | null
    shoes: ClothingData | null
    bag: ClothingData | null
    accessory: ClothingData | null
    onepiece: ClothingData | null
  }>({
    outer: null,
    top: null,
    bottom: null,
    shoes: null,
    bag: null,
    accessory: null,
    onepiece: null,
  })

  const selectedClothingItems = Object.values(outfit).filter(
    Boolean,
  ) as ClothingData[]

  const handleAddItem = (type: ClothingItem['type']) => {
    // 여기서 실제로는 이미지 선택 로직이 들어갑니다.
    // 예시를 위해 임시 이미지 URL을 사용합니다.
    const newImage = '/images/sample_clothing.jpg'
    setClothingItems((prev) =>
      prev.map((item) =>
        item.type === type ? { ...item, image: newImage } : item,
      ),
    )
  }

  const handleRemoveItem = (type: ClothingItem['type']) => {
    setClothingItems((prev) =>
      prev.map((item) =>
        item.type === type ? { ...item, image: null } : item,
      ),
    )
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full p-4">
          <div className={styles.clothingGrid}>
            {clothingItems.map((item) => (
              <div
                key={item.type}
                className={`${styles.clothingItem} ${styles[item.type]}`}
              >
                {item.image ? (
                  <>
                    <Image
                      src={item.image}
                      alt={item.type}
                      width={100}
                      height={100}
                      layout="responsive"
                    />
                    <button
                      onClick={() => handleRemoveItem(item.type)}
                      className={styles.removeButton}
                    >
                      -
                    </button>
                  </>
                ) : (
                  <>
                    <Image
                      src={placeholderImages[item.type]}
                      alt={item.type}
                      width={100}
                      height={100}
                      layout="responsive"
                      className="opacity-10"
                    />
                    <button
                      onClick={() => handleAddItem(item.type)}
                      className={styles.addButton}
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-md mt-4">
        <h2 className="text-xl font-semibold mb-10 pl-10">선택한 옷</h2>
        {selectedClothingItems.length > 0 ? (
          <ul>
            {selectedClothingItems.map((item) => (
              <li key={item.id} className="mb-2 p-2 border rounded">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 mr-4">
                    {item.pattern?.img && (
                      <img src={item.pattern.img} alt={item.name} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-md font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.purchaseDate}</p>
                  </div>
                </div>
              </li>
            ))}
            {/* <Link
key={item.id}
href={`/closet/modify/${item.id}`}
passHref
>
<div className="flex items-center mb-4 mt-4 cursor-pointer">
<Image
    src={item.image}
    alt={item.name}
    width={50}
    height={50}
    className="mr-4"
/>
<div>
    <div className="text-sm text-gray-500">
    {item.purchaseDate}
    </div>
    <div className="text-lg font-semibold">{item.name}</div>
</div>
</div>
<hr />
</Link> */}
          </ul>
        ) : (
          <p className="text-gray-dark text-center mb-10">
            아직 추가된 옷이 없어요
          </p>
        )}
        <div className="mt-4 flex justify-around">
          <SaveCoordiButton />
          <ShareCommunityButton />
        </div>
      </div>
    </>
  )
}
