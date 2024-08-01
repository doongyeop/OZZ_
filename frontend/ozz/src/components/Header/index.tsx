import { ReactNode } from 'react'

interface HeaderProps {
  title: string
  leftButton?: ReactNode
  rightButton?: ReactNode
}

export default function Header({
  title,
  leftButton,
  rightButton,
}: HeaderProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-secondary text-primary-400 h-20">
      <div className="relative flex justify-between items-center h-full mx-4">
        <button>{leftButton}</button>
        <h1 className="absolute -translate-x-1/2 left-1/2 text-3xl font-bold">
          {title}
        </h1>
        <button>{rightButton}</button>
      </div>
    </header>
  )
}
