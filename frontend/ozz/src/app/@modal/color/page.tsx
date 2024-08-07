import { useState } from 'react'
import Modal from '@/components/Modal'

type ColorModalProps = {
  onClose: () => void
  setValue: (value: { name: string; code: string }[]) => void
}

const colors = [
  { name: '흰색', code: '#FFFFFF' },
  { name: '검정', code: '#000000' },
  { name: '회색', code: '#E7E7E7' },
  { name: '빨강', code: '#FF0000' },
  { name: '분홍', code: '#FEE0DE' },
  { name: '주황', code: '#FF820E' },
  { name: '베이지', code: '#E2C79C' },
  { name: '노랑', code: '#FEE600' },
  { name: '갈색', code: '#844F1D' },
  { name: '초록', code: '#1A9268' },
  { name: '카키', code: '#666B17' },
  { name: '민트', code: '#6BF1D8' },
  { name: '파랑', code: '#1F4CE3' },
  { name: '남색', code: '#060350' },
  { name: '하늘', code: '#C5E3FF' },
  { name: '보라', code: '#9C53BE' },
  { name: '연보라', code: '#D7BEF5' },
  { name: '와인', code: '#9E213F' },
  { name: '네온', code: '#2FF40A' },
  { name: '골드', code: '#E6C345' },
]

export default function ColorModal({ onClose, setValue }: ColorModalProps) {
  const [selectedColor, setSelectedColor] = useState<
    { name: string; code: string }[]
  >([])

  const handleColorClick = (color: { name: string; code: string }) => {
    const isSelected = selectedColor.find((c) => c.name === color.name)

    if (isSelected) {
      // 이미 선택된 색상일 경우 배열에서 제거
      setSelectedColor((prevColors) =>
        prevColors.filter((selectedColor) => selectedColor.name !== color.name),
      )
    } else {
      // 선택된 색상이 아니면 배열에 추가
      setSelectedColor((prevColors) => [...prevColors, color])
    }
  }

  const handleSave = () => {
    setValue(selectedColor)
    onClose()
  }

  return (
    <Modal title="색" onClose={onClose}>
      <div className="flex flex-wrap w-full">
        {colors.map((color) => (
          <button
            key={color.name}
            type="button"
            className={`p-1 mr-1 mb-1 rounded-xl text-xs font-semibold border-2 border-primary-400 ${
              selectedColor.some(
                (selectedColor) => selectedColor.name === color.name,
              )
                ? 'bg-primary-400 text-secondary'
                : 'bg-secondary text-primary-400'
            }`}
            onClick={() => handleColorClick(color)}
          >
            <div className="flex">
              <span
                className="inline-block w-4 h-4 rounded-full mr-1"
                style={{ backgroundColor: color.code }}
              ></span>
              <span className="mr-0.5">{color.name}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-2 flex w-full justify-center">
        <button
          className="w-[55px] h-[25px] border-2 border-primary-400 rounded-2xl bg-secondary text-primary-400 text-xs font-semibold hover:bg-primary-400 hover:text-secondary"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </Modal>
  )
}
