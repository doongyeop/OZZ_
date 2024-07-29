// src/components/CategorySidebar.tsx
import React, { useState } from 'react'

interface CategorySidebarProps {
  onSelectCategory: (category: string) => void
}

const categories = ['상의', '하의', '아우터', '액세서리']

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform`}
    >
      <button
        className="absolute top-4 right-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close' : 'Open'}
      </button>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>
        <ul>
          {categories.map((category) => (
            <li key={category} className="mb-2">
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

export default CategorySidebar
