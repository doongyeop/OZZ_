// src/contexts/CategorySidebarContext.tsx

'use client'

import { createContext, useContext, useState, useMemo, ReactNode } from 'react'

interface CategorySidebarContextType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  selectedCategory: string | null
  selectedSubcategory: string | null
  setCategory: (category: string, subcategory: string) => void
}

const CategorySidebarContext = createContext<
  CategorySidebarContextType | undefined
>(undefined)

export function CategorySidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  )

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)

  const setCategory = (category: string, subcategory: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
    closeSidebar()
  }

  const value = useMemo(
    () => ({
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
      selectedCategory,
      selectedSubcategory,
      setCategory,
    }),
    [isSidebarOpen, selectedCategory, selectedSubcategory],
  )

  return (
    <CategorySidebarContext.Provider value={value}>
      {children}
    </CategorySidebarContext.Provider>
  )
}

export function useCategorySidebar() {
  const context = useContext(CategorySidebarContext)
  if (context === undefined) {
    throw new Error(
      'useCategorySidebar must be used within a CategorySidebarProvider',
    )
  }
  return context
}
