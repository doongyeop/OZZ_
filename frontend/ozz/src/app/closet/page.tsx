'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { HeaderButton } from '@/components/Button/HeaderButton'
import ClosetPageContainer from '@/containers/closet-page'

import { FaBars } from 'react-icons/fa'
import Image from 'next/image'

export default function Closet() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidabar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const leftButton = <HeaderButton icon={<FaBars />} onClick={toggleSidabar} />
  const rightButton = (
    <HeaderButton
      icon={
        <Image
          src="/icons/fitting.svg"
          alt="Fitting Icon"
          width={24}
          height={24}
        />
      }
      href="/fitting"
    />
  )

  // 여기 있는 header를 레이아웃으로 분리하려면 전역 상태관리가 들어가야합니다.
  // 상단바 버튼을 클릭하는 상태를 props로 전달해야하기 때문...
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
