'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import html2canvas from 'html2canvas'

import styles from '@/styles/FittingPage.module.css'
import SaveCoordiButton from '@/components/Button/SaveCoordiButton'
import ShareCommunityButton from '@/components/Button/ShareCommunityButton'
import ClosetSidebar from '@/components/Sidebar/ClosetSidebar'
import Modal from '@/components/Modal'
import CoordiNameModal from '@/components/Modal/CoordiNameModal'
import CoordiStyleModal from '@/components/Modal/CoordiStyleModal'
import ConfirmModal from '@/components/Modal/ConfirmModal'
import { FaPlus, FaMinus } from 'react-icons/fa'
import {
  ClothesBasicWithFileResponse,
  CoordinateCreateRequest,
  CreateCoordinatePayload,
} from '@/types/clothes/data-contracts'
import {
  categoryLowIdToHighNameMap,
  Style,
  categoryIdMap,
} from '@/types/clothing'
import { FavoriteGroupCreateRequest } from '@/types/favorite/data-contracts'
import { createCoordinate } from '@/services/clothingApi'
import {
  getFavoritesGroupListOfUsers,
  createFavoriteGroup,
  addFavorite,
} from '@/services/favoriteApi'

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

// 랜덤한 파스텔톤 색상을 생성하는 함수
const generateRandomPastelColor = () => {
  const randomValue = () => Math.floor(Math.random() * 128 + 127).toString(16) // 127~255 사이의 값으로 파스텔톤 생성
  const r = randomValue()
  const g = randomValue()
  const b = randomValue()
  return `#${r}${g}${b}`
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
  const fittingContainerRef = useRef<HTMLDivElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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

  const handleStyleSubmit = async (selectedStyles: Style[]) => {
    console.log('코디이름 : ', coordiName)
    console.log('selectedStyles : ', selectedStyles)
    setStyleList(selectedStyles)
    setIsStyleModalOpen(false)

    // 로딩 화면?

    // 코디 생성하기 START
    const clothesList = selectedClothes.map((item) => {
      const categoryLowId = item.categoryLow?.categoryLowId
      const offset =
        categoryLowId !== undefined ? categoryIdMap[categoryLowId] : null // 기본값으로 null 사용

      return {
        clothesId: item.clothesId,
        offset: offset || 0, // null이거나 정의되지 않은 경우 기본값 0 사용 (필요에 따라 조정 가능)
      }
    })

    const coordinateRequest: CoordinateCreateRequest = {
      name: coordiName,
      styleList,
      clothesList,
    }

    // 1. 랜덤 파스텔톤 배경색 생성
    const randomBackgroundColor = generateRandomPastelColor()
    const originalBackgroundColor =
      fittingContainerRef.current!.style.backgroundColor

    // 2. 이미지 생성 전에 배경색 적용
    fittingContainerRef.current!.style.backgroundColor = randomBackgroundColor

    try {
      const width = 900 // 9:16 비율의 가로 크기
      const height = 1600 // 9:16 비율의 세로 크기

      // 3. HTML을 캔버스로 변환
      const canvas = await html2canvas(fittingContainerRef.current!, {
        width,
        height,
        ignoreElements: (element) => element.tagName === 'BUTTON', // BUTTON 태그 무시
      })

      // 4. 캔버스를 Blob (이미지 파일)로 변환
      canvas.toBlob(async (blob) => {
        fittingContainerRef.current!.style.backgroundColor =
          originalBackgroundColor
        if (!blob) {
          alert('이미지 생성에 실패했습니다.')
          return
        }

        const imageFile = new File([blob], 'coordinate.png', {
          type: 'image/png',
        })

        // 5. 코디 정보를 생성
        // 6. API 요청 데이터 준비
        const payload: CreateCoordinatePayload = {
          imageFile,
          request: coordinateRequest,
        }

        console.log('payload ', payload)

        try {
          const coordinateId = await createCoordinate(payload)
          // 성공 처리 (예: 확인 모달 띄우기, 페이지 이동 등)

          // 코디북 조회
          const favoriteGroups = await getFavoritesGroupListOfUsers()

          let targetFavoriteGroupId: number

          // 코디북이 없으면 기본 코디북 생성
          if (favoriteGroups.length === 0) {
            const requestData: FavoriteGroupCreateRequest = {
              name: '기본 코디북',
            }
            const createdGroup = await createFavoriteGroup(requestData)
            console.log('createdGroup', createdGroup)
            targetFavoriteGroupId = createdGroup[0].favoriteGroupId
          } else {
            // 코디북이 존재하면 첫 번째 코디북의 ID를 사용
            targetFavoriteGroupId = favoriteGroups[0].favoriteGroupId

            // 코디북 선택 모달을 띄워 사용자에게 선택하게 할 수 있습니다.
            // 선택된 targetFavoriteGroupId를 사용합니다.
          }

          const response = await addFavorite(
            targetFavoriteGroupId,
            coordinateId,
          )
          console.log('response ', response)
          setIsConfirmModalOpen(true)
        } catch (error) {
          console.error('코디 생성 실패:', error)
          // 실패 처리 (예: 에러 메시지 표시)
        }
      })
    } catch (error) {
      console.error('코디 저장 중 오류 발생:', error)
      alert('코디 저장 중 오류가 발생했습니다.')
      fittingContainerRef.current!.style.backgroundColor =
        originalBackgroundColor
    }
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
    // 코디북 페이지로 이동?
    console.log('저장 완료!')
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="w-full p-4" ref={fittingContainerRef}>
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
                <div className="flex items-center cursor-pointer">
                  <Link href={`/closet/modify/${item.clothesId}`} passHref>
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
                  </Link>
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
        {/* 미리보기 영역 */}
        {previewUrl && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">코디 미리보기</h2>
            <Image
              src={previewUrl}
              alt="코디 미리보기"
              width={300}
              height={300}
            />
          </div>
        )}
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
              onConfirm={closeModal}
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
