import { ReactElement } from 'react'

interface HeaderButtonProps {
  icon: ReactElement
  onClick?: () => void
}

export function HeaderButton({ icon, onClick }: HeaderButtonProps) {
  return (
    <button onClick={onClick} className="p-2">
      {' '}
      {icon}{' '}
    </button>
  )
}
