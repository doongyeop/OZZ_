import { ReactElement } from 'react'
import Link from 'next/link'

interface HeaderButtonProps {
  icon: ReactElement
  onClick?: () => void
  href?: string
}

export function HeaderButton({ icon, onClick, href }: HeaderButtonProps) {
  const buttonContent = <div className="p-2">{icon}</div>

  if (href) {
    return <Link href={href}>{buttonContent}</Link>
  }

  return (
    <button onClick={onClick} className="">
      {buttonContent}
    </button>
  )
}
