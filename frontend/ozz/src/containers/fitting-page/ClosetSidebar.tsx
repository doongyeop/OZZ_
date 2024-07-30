'use client'
import { useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/ClosetSidebar.module.css'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import CategoryModal from '@/app/@modal/category/page'

type ClothingItem = {
  id: string
  image: string
  category: string
}

export default function ClosetSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [category, setCategory] = useState('카테고리')

  // 이 부분은 실제 데이터를 가져오는 로직으로 대체해야 합니다.
  // TODO : 사용자의 옷장 목록 가져오기 API 구현
  const dummyClothes: ClothingItem[] = [
    { id: '1', image: '/images/mockup/tops01.png', category: 'top' },
    { id: '2', image: '/images/mockup/pants01.png', category: 'bottom' },
    { id: '3', image: '/images/mockup/outer01.png', category: 'outer' },
    { id: '4', image: '/images/mockup/shoes01.png', category: 'shoes' },
    { id: '5', image: '/images/mockup/shoes02.png', category: 'shoes' },
  ]

  return (
    <>
      <div className={`${styles.sidebarGroup} ${isOpen ? styles.open : ''}`}>
        <button
          className={`${isOpen ? styles.toggleButtonOpen : styles.toggleButtonClose} flex justify-center`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </button>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h3>내 옷짱에서 가져오기</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex justify-center items-center px-2 py-0.5 m-1 rounded-lg border-2 border-primary-400 text-primary-400 text-sm"
            >
              {category} <FaChevronDown className="ml-2" />
            </button>
          </div>
          <div className={styles.clothesList}>
            {dummyClothes.map((item) => (
              <div key={item.id} className={styles.clothItem}>
                <Image
                  src={item.image}
                  alt={item.category}
                  width={80}
                  height={80}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <CategoryModal
          onClose={() => setIsModalOpen(false)}
          setValue={setCategory}
        />
      )}
    </>
  )
}
