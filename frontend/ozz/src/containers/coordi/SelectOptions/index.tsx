'use client'

import { useState } from 'react'
import ColorModal from '@/app/@modal/color/page'
import { MdOutlineColorLens } from 'react-icons/md'
import { BiCloset } from 'react-icons/bi'
import OutlineButton from '@/components/Button/OutlineButton'

export default function SelectOptions() {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<{
    name: string
    code: string
  } | null>(null)

  return (
    <>
      <div className="m-4 flex space-x-4">
        <OutlineButton onClick={() => setIsColorModalOpen(true)}>
          <div className="flex flex-col items-center py-3">
            <MdOutlineColorLens className="text-primary-400 " />
            <span>포인트 컬러 고르기</span>
          </div>
        </OutlineButton>
        <OutlineButton>
          <div className="flex flex-col items-center py-3">
            <BiCloset className="text-primary-400 " />
            <span>필수 아이템 고르기</span>
          </div>
        </OutlineButton>
      </div>
    </>
  )
}
