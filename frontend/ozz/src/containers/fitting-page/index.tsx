'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/FittingPage.module.css'

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
      <div>선택한 옷</div>
    </>
  )
}
