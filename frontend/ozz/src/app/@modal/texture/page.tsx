import { useState } from 'react'
import Modal from '@/components/Modal'

type MaterialType = {
  [key: string]: boolean
}

const mainMaterials = [
  '면',
  '폴리',
  '린넨',
  '스판',
  '울',
  '앙고라',
  '레이온',
  '기모',
  '데님',
  '스웨이드',
  '나일론',
  '가죽',
  '실크',
  '기타',
]

const otherMaterials = [
  '퍼',
  '무스탕',
  '코듀로이',
  '시퀸/글리터',
  '저지',
  '트위드',
  '벨벳',
  '비닐',
  '합성섬유',
  '니트',
  '레이스',
  '메시',
  '플리스',
  '네오프렌',
  '자카드',
  '시폰',
]

const TextureModal: React.FC<{
  onClose: () => void
  setValue: (value: string[]) => void
}> = ({ onClose, setValue }) => {
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialType>({})
  const [showOtherMaterials, setShowOtherMaterials] = useState(false)

  const handleMaterialClick = (material: string) => {
    if (material === '기타') {
      setShowOtherMaterials(!showOtherMaterials)
    } else {
      setSelectedMaterials((prev) => ({
        ...prev,
        [material]: !prev[material],
      }))
    }
  }

  const handleSave = () => {
    const selectedList = Object.entries(selectedMaterials)
      .filter(([_, isSelected]) => isSelected)
      .map(([material]) => material)
    setValue(selectedList)
    onClose()
  }

  return (
    <Modal title="소재" onClose={onClose}>
      <div className="flex flex-wrap w-full l-1 pr-2">
        {mainMaterials.map((material) => (
          <button
            key={material}
            type="button"
            className={`px-2 py-0.5 m-1 rounded-lg border-2 text-sm ${
              material === '기타'
                ? showOtherMaterials
                  ? 'border-primary-400 text-secondary bg-primary-400'
                  : 'border-primary-400 text-primary-400 bg-secondary'
                : selectedMaterials[material]
                  ? 'border-primary-400 text-secondary bg-primary-400'
                  : 'border-primary-400 text-primary-400 bg-secondary'
            }`}
            onClick={() => {
              if (material === '기타') {
                setShowOtherMaterials(!showOtherMaterials)
              } else {
                handleMaterialClick(material)
              }
            }}
          >
            {material}
          </button>
        ))}
        {showOtherMaterials && (
          <div className="flex flex-wrap">
            {otherMaterials.map((material) => (
              <button
                key={material}
                type="button"
                className={`px-2 py-0.5 m-1 rounded-lg border-2 text-sm ${
                  selectedMaterials[material]
                    ? 'border-primary-400 text-secondary bg-primary-400'
                    : 'border-primary-400 text-primary-400 bg-secondary'
                }`}
                onClick={() => handleMaterialClick(material)}
              >
                {material}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 flex w-full justify-center">
          <button
            className="w-[55px] h-[25px] border-2 border-primary-400 rounded-2xl bg-secondary text-primary-400 text-xs font-semibold hover:bg-primary-400 hover:text-secondary"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default TextureModal
