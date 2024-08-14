'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import styles from '@/styles/FittingPage.module.css'
import SaveCoordiButton from '@/components/Button/SaveCoordiButton'
import ShareCommunityButton from '@/components/Button/ShareCommunityButton'
import ClosetSidebar from '@/components/Sidebar/ClosetSidebar'
import Modal from '@/components/Modal'
import CoordiNameModal from '@/components/Modal/CoordiNameModal'
import CoordiStyleModal from '@/components/Modal/CoordiStyleModal'
import ConfirmModal from '@/components/Modal/ConfirmModal'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { ClothesBasicWithFileResponse } from '@/types/clothes/data-contracts'
import { categoryLowIdToHighNameMap, Style } from '@/types/clothing'

type FittingItem = {
  category: string
  type: string
  image: string | null
  isSelected: boolean
}

const placeholderImages: { [key: string]: string } = {
  악세서리: '/images/fitting/accessory.png',
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
    { category: '악세서리', type: 'accessory', image: null, isSelected: false },
    { category: '원피스', type: 'onepiece', image: null, isSelected: false },
    { category: '상의', type: 'top', image: null, isSelected: false },
    { category: '아우터', type: 'outer', image: null, isSelected: false },
    { category: '하의', type: 'bottom', image: null, isSelected: false },
    { category: '신발', type: 'shoes', image: null, isSelected: false },
    { category: '가방', type: 'bag', image: null, isSelected: false },
  ])
  const [selectedClothes, setSelectedClothes] = useState<
    (ClothesBasicWithFileResponse & { imageUrl: string })[]
  >([]) // 선택한 옷 리스트

  const [isCoordiModalOpen, setIsCoordiModalOpen] = useState(false) // 코디 이름 설정 모달
  const [isStyleModalOpen, setIsStyleModalOpen] = useState(false) // 스타일 태그 설정 모달
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false) // 확인 모달
  const [coordiName, setCoordiName] = useState('') // 코디 이름
  const [styleList, setStyleList] = useState<Style[]>([]) // 스타일 태그

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
      selectedClothes.filter((cloth) => {
        const categoryLowId = cloth.categoryLow?.categoryLowId
        if (categoryLowId === undefined) {
          return true // `undefined`인 경우 필터링하지 않음 (필요에 따라 다르게 처리할 수 있음)
        }
        return categoryLowIdToHighNameMap[categoryLowId] !== category
      }),
    )
  }

  const handleSelectClothingItem = (
    item: ClothesBasicWithFileResponse & { imageUrl: string },
  ) => {
    // 사이드바에서 아이템을 선택하면
    const existingItem = selectedClothes.find(
      (clothingItem) => clothingItem.clothesId === item.clothesId,
    )
    if (existingItem) {
      console.error('이미 선택한 아이템입니다.')
      return
    }

    const categoryLowId = item.categoryLow?.categoryLowId
    const categoryHighName = categoryLowId
      ? categoryLowIdToHighNameMap[categoryLowId]
      : undefined

    if (!categoryHighName) {
      console.error('잘못된 카테고리 ID입니다.')
      return
    }

    const placeholder = fittingItems.find((imageholder) => {
      return imageholder.category === categoryHighName
    })

    // console.log('placeholder ', placeholder)
    if (!placeholder || placeholder.category !== selectedCategory) {
      // console.log('선택 : ', selectedCategory, ' <- ', placeholder)
      console.error('잘못된 위치입니다.')
      return
    }

    const updatedFittingItems = fittingItems.map((fittingItem) =>
      fittingItem.category === categoryHighName
        ? {
            ...fittingItem,
            image: item.imageUrl ? item.imageUrl : '',
            isSelected: true,
          }
        : fittingItem,
    )
    // console.log('현재 세팅 : ', updatedFittingItems)
    setFittingItems(updatedFittingItems)
    setSelectedClothes([...selectedClothes, item])
    setIsSidebarOpen(false)
  }

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    // console.log('사이드바에서 선택 ', category)
  }

  const handleSaveCoordi = () => {
    if (selectedClothes.length === 0) {
      alert('적어도 한 가지 아이템을 선택해야 합니다.')
      return
    }
    setIsCoordiModalOpen(true)
  }

  const handleCoordiNameSubmit = (name: string) => {
    setCoordiName(name)
    setIsCoordiModalOpen(false)
    setIsStyleModalOpen(true)
  }

  const handleStyleSubmit = (selectedStyles: Style[]) => {
    setStyleList(selectedStyles)
    setIsStyleModalOpen(false)
    setIsConfirmModalOpen(true)
    // 코디북 저장 로직 호출
  }

  const handlePrevFromStyle = () => {
    setIsStyleModalOpen(false)
    setIsCoordiModalOpen(true)
  }

  const handlePrevFromConfirm = () => {
    setIsConfirmModalOpen(false)
    setIsStyleModalOpen(true)
  }

  const closeModal = () => {
    setIsCoordiModalOpen(false) // 코디 이름 설정 모달
    setIsStyleModalOpen(false) // 스타일 태그 설정 모달
    setIsConfirmModalOpen(false)
  }

  const handleConfirm = () => {
    console.log('저장 완료!')
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full p-4">
          <div className={styles.clothingGrid}>
            {fittingItems.map((item) => (
              <div
                key={item.type}
                className={`${styles.clothingItem} ${styles[item.type]} flex items-center justify-center`}
              >
                {item.image ? (
                  <>
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        position: 'relative',
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.category}
                        layout="fill" // 이미지가 부모 div를 채우도록
                        objectFit="contain" // 비율을 유지하며 최대 크기에 맞춤
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                        }}
                      />
                    </div>
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
              <li key={item.clothesId} className="mb-2 p-3 border-b">
                <Link href={`/closet/modify/${item.clothesId}`} passHref>
                  <div className="flex items-center cursor-pointer">
                    <div className="flex justify-center items-center w-16 h-16 bg-gray-light mr-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name ?? 'No name'}
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
                    <div className="flex flex-row w-full justify-between">
                      <div className="flex flex-col">
                        <p className="mb-2">{item.categoryLow?.name}</p>
                        <p className="text-md font-semibold">{item.name}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="제거"
                        onClick={() => {
                          const categoryLowId = item.categoryLow?.categoryLowId
                          if (categoryLowId !== undefined) {
                            const highCategoryName =
                              categoryLowIdToHighNameMap[categoryLowId]
                            handleRemoveItem(highCategoryName)
                          } else {
                            console.error('카테고리 ID가 유효하지 않습니다.')
                          }
                        }}
                        className="flex items-center justify-center bg-secondary text-primary-400 rounded-full h-6 w-6"
                      >
                        <FaMinus />
                      </button>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-dark text-center mb-10">
            아직 추가된 옷이 없어요
          </p>
        )}
        <div className="mt-4 flex justify-around">
          <SaveCoordiButton
            onClick={handleSaveCoordi}
            disabled={selectedClothes.length === 0}
          />
          <ShareCommunityButton />
        </div>

        {isCoordiModalOpen && (
          <Modal onClose={() => setIsCoordiModalOpen(false)}>
            <CoordiNameModal
              setValue={handleCoordiNameSubmit}
              onClose={closeModal}
            />
          </Modal>
        )}
        {isStyleModalOpen && (
          <Modal onClose={() => setIsStyleModalOpen(false)}>
            <CoordiStyleModal
              setValue={handleStyleSubmit}
              onPrev={handlePrevFromStyle}
              onClose={closeModal}
            />
          </Modal>
        )}
        {isConfirmModalOpen && (
          <Modal onClose={() => setIsConfirmModalOpen(false)}>
            <ConfirmModal
              onClose={() => setIsConfirmModalOpen(false)}
              message="코디북에 저장되었습니다!"
              onConfirm={handleConfirm}
            />
          </Modal>
        )}
      </div>

      <ClosetSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        category={selectedCategory}
        onSelectItem={handleSelectClothingItem}
        onCategoryChange={handleCategoryChange}
      />
    </>
  )
}
