'use client'

import { IoChevronBack } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { HeaderButton } from '../Button/HeaderButton'
import Header from '../Header'

export default function HeaderWithBackward({ title = '추천 코디' }) {
  const router = useRouter()

  return (
    <Header
      title={title}
      leftButton={
        <HeaderButton
          icon={<IoChevronBack size={28} />}
          onClick={() => router.back()}
        />
      }
    />
  )
}
