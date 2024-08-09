'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

import { BiCloset } from 'react-icons/bi'
import { MdOutlineColorLens } from 'react-icons/md'

import ColorModal from '@/components/Modal/ColorModal'
import OutlineButton from '@/components/Button/OutlineButton'
import { useSelectedItem } from '@/contexts/SelectedItemContext'
import { useSelectedColor } from '@/contexts/SelectedColorContext'

export default function SelectOptions() {
  const router = useRouter()
  const { selectedItem } = useSelectedItem()
  const { selectedColor, setSelectedColor } = useSelectedColor()

  const [isColorModalOpen, setIsColorModalOpen] = useState(false)

  const handleColorSelect = (colors: { name: string; code: string }[]) => {
    if (colors.length <= 2) {
      setSelectedColor(colors)
    } else {
      alert('최대 2개의 색상만 선택할 수 있습니다.')
    }
  }

  const isLightColor = (color: string) => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 186
  }

  return (
    <>
      <div className="m-4 flex space-x-4 h-24">
        <OutlineButton onClick={() => setIsColorModalOpen(true)}>
          <div className="flex flex-col items-center">
            {selectedColor.length === 0 ? (
              <>
                <MdOutlineColorLens className="text-primary-400 " />
                <span>포인트 컬러 고르기</span>
              </>
            ) : (
              <div className="flex space-x-2">
                {selectedColor.map((color) => (
                  <div
                    key={color.name}
                    className={`flex flex-col items-center ${
                      isLightColor(color.code)
                        ? 'bg-secondary'
                        : 'bg-gray-light'
                    } p-3 rounded-lg`}
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{
                        backgroundColor: color.code,
                      }}
                    />
                    <span
                      className="text-xs mt-1"
                      style={{ color: color.code }}
                    >
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </OutlineButton>
        <OutlineButton onClick={() => router.push('/coordi/select-item')}>
          <div className="flex flex-col items-center">
            {selectedItem ? (
              <div className="flex flex-col items-center">
                <Image
                  src={selectedItem.imageFile.filePath}
                  alt={selectedItem.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <span className="text-xs mt-1">{selectedItem.name}</span>
              </div>
            ) : (
              <>
                <BiCloset className="text-primary-400" />
                <span>필수 아이템 고르기</span>
              </>
            )}
          </div>
        </OutlineButton>
      </div>
      {isColorModalOpen && (
        <ColorModal
          onClose={() => setIsColorModalOpen(false)}
          setValue={handleColorSelect}
        />
      )}
    </>
  )
}
