'use client'

import { createContext, useContext, useState, ReactNode, useMemo } from 'react'

interface SelectedItemContextType {
  selectedItem: any
  setSelectedItem: (item: any) => void
}

const SelectedItemContext = createContext<SelectedItemContextType | undefined>(
  undefined,
)

interface SelectedItemProviderProps {
  children: ReactNode
}

export function SelectedItemProvider({ children }: SelectedItemProviderProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const value = useMemo(
    () => ({ selectedItem, setSelectedItem }),
    [selectedItem],
  )

  return (
    <SelectedItemContext.Provider value={value}>
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
