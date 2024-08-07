import React, { useState } from 'react'
import Modal from '@/components/Modal'

type CategoryModalProps = {
  onClose: () => void
  setValue: (value: string) => void
}

type CategoryType = {
  상의: string[]
  하의: string[]
  신발: string[]
  가방: string[]
  아우터: string[]
  원피스: string[]
  액세서리: string[]
}

const categories = {
  상의: [
    '반팔',
    '긴팔',
    '셔츠',
    '캐주얼',
    '베스트',
    '민소매',
    '7부소매',
    '블라우스',
    '니트웨어',
  ],
  하의: ['팬츠', '청바지', '스커트'],
  신발: ['운동화', '구두', '샌들'],
  가방: ['가방'],
  아우터: ['자켓', '코트', '패딩', '점퍼'],
  원피스: ['드레스', '점프수트', '수영복'],
  액세서리: ['주얼리', '모자', '기타'],
}

export default function CategoryModal({
  onClose,
  setValue,
}: CategoryModalProps) {
  const [category, setCategory] = useState<string>('')
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    keyof CategoryType | null
  >(null)

  const handleMainCategoryClick = (mainCategory: keyof CategoryType) => {
    setSelectedMainCategory((prevCategory) =>
      prevCategory === mainCategory ? null : mainCategory,
    )
  }

  const handleSubCategoryClick = (subCategory: string) => {
    setValue(`${selectedMainCategory} > ${subCategory}`)
    onClose()
  }

  const handleBack = () => {
    setSelectedMainCategory(null)
    setCategory('')
  }

  return (
    <Modal title="카테고리" onClose={onClose}>
      {!selectedMainCategory ? (
        <div className="flex flex-wrap w-full pl-1 pr-2 mb-2">
          {(Object.keys(categories) as Array<keyof CategoryType>).map(
            (mainCategory) => (
              <button
                key={mainCategory}
                type="button"
                className="px-2 py-0.5 m-1 rounded-lg border-2 border-primary-400 text-primary-400 text-sm"
                onClick={() => handleMainCategoryClick(mainCategory)}
              >
                {mainCategory}
              </button>
            ),
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap w-full pl-1 pr-2 mb-2">
            <button className="px-2 py-0.5 m-1 rounded-lg border-2 border-primary-400 text-secondary text-sm bg-primary-400 font-bold">
              {selectedMainCategory}
            </button>
            <button
              onClick={handleBack}
              className="m-1 px-3 py-0.5 rounded-lg border-2 border-primary-400 text-primary-400 text-sm"
            >
              ←
            </button>
          </div>
          {selectedMainCategory && (
            <div className="flex flex-wrap pl-1 pr-2 mb-4">
              {categories[selectedMainCategory].map((subCategory) => (
                <button
                  key={subCategory}
                  type="button"
                  className="px-2 py-0.5 ml-1 mb-1.5 rounded-lg border-2 border-primary-400 bg-secondary text-primary-400 text-sm"
                  onClick={() => handleSubCategoryClick(subCategory)}
                >
                  {subCategory}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
