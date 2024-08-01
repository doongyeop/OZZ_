'use client'

import { IoChevronBack } from 'react-icons/io5'
import { HeaderButton } from '../Button/HeaderButton'
import Header from '../Header'
import { useRouter } from 'next/navigation'

export default function HeaderWithBackward() {
  const router = useRouter()

  return (
    <Header
      title="추천 코디"
      leftButton={
        <HeaderButton
          icon={<IoChevronBack size={28} />}
          onClick={() => router.back()}
        />
      }
    />
  )
}
