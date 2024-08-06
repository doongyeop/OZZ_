'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaChevronDown } from 'react-icons/fa'
import styles from '@/styles/ClosetSidebar.module.css'
import CreateCoordibookModal from '@/components/Modal/CreateCoordibookModal'

type CoordibookSidebarProps = {
  boardId: number
  userId: number
  onClose: () => void
  onBookmarkToggle: () => void
}

type Coordibook = {
  coordinateId: number
  name: string
  styleList: string[]
  createdDate: string
  imageFile: {
    fileId: number
    filePath: string
    fileName: string
    fileType: string
  }
}

export default function CoordibookSidebar({
  boardId,
  userId,
  onClose,
  onBookmarkToggle,
}: CoordibookSidebarProps) {
  const [coordibooks, setCoordibooks] = useState<Coordibook[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    // 실제 API 호출 대신 목업 데이터를 사용
    const mockCoordibooks = {
      totalPages: 1,
      totalElements: 2,
      size: 20,
      content: [
        {
          coordinateId: 1,
          name: '서터릿 코디',
          styleList: ['STREET'],
          createdDate: '2024-08-06T01:40:12.825788',
          imageFile: {
            fileId: 4,
            filePath: 'a386bdca-2d2e-416d-932f-b988630d63ce.상의.png',
            fileName: '상의.png',
            fileType: 'image/png',
          },
        },
        {
          coordinateId: 2,
          name: '멋진 코디',
          styleList: ['STREET'],
          createdDate: '2024-08-06T01:40:12.825788',
          imageFile: {
            fileId: 4,
            filePath: 'a386bdca-2d2e-416d-932f-b988630d63ce.상의.png',
            fileName: '상의.png',
            fileType: 'image/png',
          },
        },
      ],
      number: 0,
      sort: [],
      pageable: {
        pageNumber: 0,
        pageSize: 20,
        sort: [],
        offset: 0,
        paged: true,
        unpaged: false,
      },
      first: true,
      last: true,
      numberOfElements: 1,
      empty: false,
    }

    setCoordibooks(mockCoordibooks.content)
  }, [])

  const handleCreateCoordibook = (name: string) => {
    // 새 코디북 생성 API 호출
    const newCoordibook = {
      coordinateId: Date.now(),
      name,
      styleList: [],
      createdDate: new Date().toISOString(),
      imageFile: { fileId: 0, filePath: '', fileName: '', fileType: '' },
    }
    setCoordibooks((prev) => [newCoordibook, ...prev])
    setIsCreateModalOpen(false)
  }

  const handleCoordibookSelect = async (coordibookId: number) => {
    try {
      // 코디북에 게시글 추가 API 호출
      await fetch('/api/coordibook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardId, coordibookId }),
      })
      onBookmarkToggle()
      onClose()
    } catch (error) {
      console.error('Failed to add to coordibook:', error)
    }
  }

  return (
    <>
      <div className={`${styles.sidebarGroup}`}>
        <button
          className={`${styles.toggleButtonClose} flex justify-center`}
          onClick={() => onClose()}
        >
          <FaChevronDown />
        </button>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <h3>코디북</h3>
          </div>
          <div className={styles.clothesList}>
            {dummyClothes.map((item) => (
              <div
                key={item.id}
                className={styles.clothItem}
                onClick={() => onSelectItem(item)}
              >
                <Image
                  src={item.imageFile.filePath}
                  alt={item.name}
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
          setValue={handleCategoryChange}
        />
      )}
    </>
  )
}
