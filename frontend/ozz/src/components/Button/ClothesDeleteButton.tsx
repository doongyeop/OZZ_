import { FaTrash } from 'react-icons/fa'

type ClothesDeleteButtonProps = {
  onClick: () => void
}

export default function ClothesDeleteButton({
  onClick,
}: ClothesDeleteButtonProps) {
  return (
    <div
      onClick={onClick}
      className="fixed bottom-[88px] right-8 bg-secondary text-primary-400 border border-primary-40 rounded-full p-4 shadow-lg flex items-center justify-center"
      style={{ width: '60px', height: '60px' }}
    >
      <FaTrash size={20} />
    </div>
  )
}
