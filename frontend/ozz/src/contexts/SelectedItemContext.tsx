// context/SelectedItemContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface SelectedItemContextType {
  selectedItem: any
  setSelectedItem: (item: any) => void
}

const SelectedItemContext = createContext<SelectedItemContextType | undefined>(
  undefined,
)

export const SelectedItemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedItem, setSelectedItem] = useState<any>(null)

  return (
    <SelectedItemContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SelectedItemContext.Provider>
  )
}

export const useSelectedItem = () => {
  const context = useContext(SelectedItemContext)
  if (!context) {
    throw new Error(
      'useSelectedItem must be used within a SelectedItemProvider',
    )
  }
  return context
}
