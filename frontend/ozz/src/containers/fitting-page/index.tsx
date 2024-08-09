'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/FittingPage.module.css'
import SaveCoordiButton from '@/components/Button/SaveCoordiButton'
import ShareCommunityButton from '@/components/Button/ShareCommunityButton'
import ClosetSidebar from '@/components/Sidebar/ClosetSidebar'
import { FaPlus, FaMinus } from 'react-icons/fa'

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

type FittingItem = {
  category: string
  type: string
  image: string | null
  isSelected: boolean
}

const placeholderImages: { [key: string]: string } = {
  액세서리: '/images/fitting/accessory.png',
  원피스: '/images/fitting/onepiece.png',
  상의: '/images/fitting/top.png',
  아우터: '/images/fitting/outer.png',
  하의: '/images/fitting/bottom.png',
  신발: '/images/fitting/shoes.png',
  가방: '/images/fitting/bag.png',
}

export default function FittingContainer() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // 사이드바 열고 닫는 변수
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null) // 사이드바에 카테고리 설정하기
  const [fittingItems, setFittingItems] = useState<FittingItem[]>([
    // 가상피팅 배경의 컴포넌트
    { category: '액세서리', type: 'accessory', image: null, isSelected: false },
    { category: '원피스', type: 'onepiece', image: null, isSelected: false },
    { category: '상의', type: 'top', image: null, isSelected: false },
    { category: '아우터', type: 'outer', image: null, isSelected: false },
    { category: '하의', type: 'bottom', image: null, isSelected: false },
    { category: '신발', type: 'shoes', image: null, isSelected: false },
    { category: '가방', type: 'bag', image: null, isSelected: false },
  ])
  const [selectedClothes, setSelectedClothes] = useState<ClothingItem[]>([]) // 선택한 옷 리스트

  const handleAddItem = (category: string) => {
    // + 버튼을 눌렀을 때
    setSelectedCategory(category)
    setIsSidebarOpen(true)
  }

  const handleRemoveItem = (category: string) => {
    // - 버튼을 눌렀을 때
    setFittingItems(
      fittingItems.map((item) =>
        item.category === category
          ? { ...item, image: null, isSelected: false }
          : item,
      ),
    )
    setSelectedClothes(
      selectedClothes.filter((cloth) => cloth.categoryHigh.name !== category),
    )
  }

  const handleSelectClothingItem = (item: ClothingItem) => {
    // 사이드바에서 아이템을 선택하면
    const existingItem = selectedClothes.find(
      (clothingItem) => clothingItem.id === item.id,
    )
    if (existingItem) {
      console.error('이미 선택한 아이템입니다.')
      return
    }

    const placeholder = fittingItems.find(
      (imageholder) => imageholder.category === item.categoryHigh.name,
    )
    if (!placeholder || placeholder.category !== selectedCategory) {
      // console.log('선택 : ', selectedCategory, ' <- ', placeholder)
      console.error('잘못된 위치입니다.')
      return
    }

    const updatedFittingItems = fittingItems.map((fittingItem) =>
      fittingItem.category === item.categoryHigh.name
        ? { ...fittingItem, image: item.imageFile.filePath, isSelected: true }
        : fittingItem,
    )
    console.log('현재 세팅 : ', updatedFittingItems)
    setFittingItems(updatedFittingItems)
    setSelectedClothes([...selectedClothes, item])
    setIsSidebarOpen(false)
  }

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    console.log('사이드바에서 선택 ', category)
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full p-4">
          <div className={styles.clothingGrid}>
            {fittingItems.map((item) => (
              <div
                key={item.type}
                className={`${styles.clothingItem} ${styles[item.type]}`}
              >
                {item.image ? (
                  <>
                    <Image
                      src={item.image}
                      alt={item.category}
                      width={100}
                      height={100}
                      layout="responsive"
                    />
                    <button
                      type="button"
                      aria-label="제거"
                      onClick={() => handleRemoveItem(item.category)}
                      className={styles.removeButton}
                    >
                      <FaMinus />
                    </button>
                  </>
                ) : (
                  <>
                    <Image
                      src={placeholderImages[item.category]}
                      alt={item.category}
                      width={100}
                      height={100}
                      layout="responsive"
                      className="opacity-10"
                    />
                    <button
                      type="button"
                      aria-label="옷 추가"
                      onClick={() => handleAddItem(item.category)}
                      className={styles.addButton}
                    >
                      <FaPlus />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-md mt-4">
        <h2 className="text-xl font-semibold pl-10 m-2">선택한 옷</h2>
        {selectedClothes.length > 0 ? (
          <ul className="mt-2 px-6">
            {selectedClothes.map((item) => (
              <li key={item.id} className="mb-2 p-3 border-b">
                <div className="flex items-center">
                  <div className="flex justify-center items-center w-16 h-16 bg-gray-light mr-4">
                    <Image
                      src={item.imageFile.filePath}
                      alt={item.name}
                      width={75}
                      height={75}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="mb-2">{item.categoryLow.name}</p>
                    <p className="text-md font-semibold">{item.name}</p>
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
      {isSidebarOpen && (
        <ClosetSidebar
          isSidebarOpen={isSidebarOpen}
          category={selectedCategory}
          onSelectItem={handleSelectClothingItem}
          onCategoryChange={handleCategoryChange}
        />
      )}
    </>
  )
}
