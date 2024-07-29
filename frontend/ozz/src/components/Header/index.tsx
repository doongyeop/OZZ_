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
    <header className="fixed top-0 inset-x-0 z-50 bg-secondary text-primary-400 py-5">
      <div className="container mx-auto flex justify-between items-center">
        <button>{leftButton}</button>
        <h1 className="text-3xl font-bold">{title}</h1>
        <button>{rightButton}</button>
      </div>
    </header>
  )
}
