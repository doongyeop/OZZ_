'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { HeaderButton } from '@/components/Button/HeaderButton'
import ClosetPageContainer from '@/containers/closet-page'

import { FaBars } from 'react-icons/fa'
import { GiClothes } from 'react-icons/gi'

export default function Closet() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidabar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const leftButton = <HeaderButton icon={<FaBars />} onClick={toggleSidabar} />

  const rightButton = (
    <HeaderButton
      icon={<GiClothes />}
      onClick={() => {
        /* 가상 피팅룸 로직 */
      }}
    />
  )

  return (
    <>
      <Header
        title="나의 옷짱"
        leftButton={leftButton}
        rightButton={rightButton}
      />
      <ClosetPageContainer
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </>
  )
}
