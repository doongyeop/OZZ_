// src/components/CategorySidebar.tsx
import { useState } from 'react'
import { IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5'

interface CategorySidebarProps {
  onSelectCategory: (category: string, subcategory: string) => void
  onClose: () => void
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

export default function CategorySidebar({
  onSelectCategory,
  onClose,
}: CategorySidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleCategory = (category: string) => {
    setExpandedCategory((prevCategory) =>
      prevCategory === category ? null : category,
    )
  }

  return (
    <div className="absolute left-0 h-full w-32 bg-secondary shadow-md transform translate-x-0 transition-transform flex flex-col">
      <div className="flex flex-col">
        <div className="mt-2 text-right">
          <button onClick={onClose} className="text-primary-400 w-6 h-6">
            <IoClose />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pl-4 pr-4">
          {Object.entries(categories).map(([category, subcategories]) => (
            <div key={category} className="mb-2">
              <button
                className={`w-full flex justify-center items-center p-2 text-center text-lg ${
                  expandedCategory === category
                    ? 'text-primary-400'
                    : 'text-gray-light'
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </button>
              {expandedCategory === category && (
                <div className="ml-4">
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      className="block w-full text-right p-1 text-gray-light hover:text-primary-400"
                      onClick={() => onSelectCategory(category, subcategory)}
                    >
                      {subcategory}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
