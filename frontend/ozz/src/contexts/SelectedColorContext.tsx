'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Color {
  name: string
  code: string
}

interface SelectedColorContextProps {
  selectedColor: Color[]
  setSelectedColor: (colors: Color[]) => void
}

const SelectedColorContext = createContext<
  SelectedColorContextProps | undefined
>(undefined)

export const SelectedColorProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [selectedColor, setSelectedColor] = useState<Color[]>([])

  return (
    <SelectedColorContext.Provider value={{ selectedColor, setSelectedColor }}>
      {children}
    </SelectedColorContext.Provider>
  )
}

export const useSelectedColor = () => {
  const context = useContext(SelectedColorContext)
  if (!context) {
    throw new Error(
      'useSelectedColor must be used within a SelectedColorProvider',
    )
  }
  return context
}
