import { useState } from 'react'
import ClothingDetailsModal from '../Modal/ClothingDetailModal'

type ClothingTagProps = {
  name: string
  x_position: number
  y_position: number
  clothesId: number
}

export default function ClothingTag({
  name,
  x_position,
  y_position,
  clothesId,
}: ClothingTagProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <div
        className="absolute flex items-center bg-white bg-opacity-50 p-1 rounded-lg"
        style={{
          top: `${y_position * 30}%`,
          left: `${x_position * 20}%`,
        }}
        onClick={handleOpenModal}
      >
        <span className="ml-1">{name}</span>
        <style jsx>{`
          .absolute {
            position: absolute;
          }
          .absolute::after {
            content: '';
            position: absolute;
            bottom: -6px; /* Adjust this value based on the size of the triangle */
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent; /* Adjust this value to change the size of the triangle */
            border-right: 6px solid transparent; /* Adjust this value to change the size of the triangle */
            border-top: 6px solid rgba(255, 255, 255, 0.5); /* Adjust this value to change the size and color of the triangle */
          }
        `}</style>
      </div>
      <ClothingDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        clothesId={clothesId}
      />
    </>
  )
}
