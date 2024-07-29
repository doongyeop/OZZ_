'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import SearchArea from '@/containers/closet-page/SearchArea'
import { HeaderButton } from '@/components/Button/HeaderButton'
import ClosetPageContainer from '@/containers/closet-page'

import { FaBars } from 'react-icons/fa'
import { GiClothes } from 'react-icons/gi'

export default function Closet() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleCategoryButtonClick = () => {
    setIsSidebarOpen((prevState) => !prevState)
  }

  const leftButton = (
    <HeaderButton icon={<FaBars />} onClick={handleCategoryButtonClick} />
  )

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
      <SearchArea />
      <ClosetPageContainer isSidebarOpen={isSidebarOpen} />
    </>
  )
}
