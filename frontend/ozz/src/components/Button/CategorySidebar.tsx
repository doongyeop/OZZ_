// src/components/CategorySidebar.tsx
import { useState } from 'react'
import { IoClose } from 'react-icons/io5'

interface CategorySidebarProps {
  onSelectCategory: (category: string) => void
  onClose: () => void
}

const categories = ['상의', '하의', '아우터', '액세서리']

export default function CategorySidebar({
  onSelectCategory,
  onClose,
}: CategorySidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary shadow-md transform translate-x-0 transition-transform`}
    >
      <div className="p-4 flex flex-col">
        <div className="text-right">
          <button onClick={onClose} className="text-primary-400 w-6 h-6">
            <IoClose width={40} hanging={40} />
          </button>
        </div>
        <ul>
          {categories.map((category) => (
            <li
              key={category}
              className="flex justify-center mt-2 mb-2 text-gray-light"
            >
              <button onClick={() => onSelectCategory(category)}>
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
