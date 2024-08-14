'use client'

import OutlineButton from '@/components/Button/OutlineButton'
import TagButton from '@/components/Button/TagButton'
import HeaderWithBackward from '@/components/HeaderWithBackward'
import Link from 'next/link'
import { MdOutlineShare } from 'react-icons/md'
import Image from 'next/image'
import { IoPencil } from 'react-icons/io5'
import { HiTrash } from 'react-icons/hi2'
import ConfirmModal from '@/components/Modal/ConfirmModal'
import { useState } from 'react'
// import {
//   fetchUserClothes,
//   createClothing,
//   deleteClothing,
// } from '@/services/clothingApi'

export default function SavedCoordiPage({
  params,
}: {
  params: { id: string }
}) {
  const coordinate = {
    id: '0',
    name: '홍대 씹어먹는 룩',
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
    styles: ['스트릿', '캐주얼'],
    items: [
      {
        id: 0,
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
      },
      {
        id: 1,
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
      },
      {
        id: 2,
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
      },
      {
        id: 3,
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
      },
    ],
  }
  const [deleteModal, setDeleteModal] = useState(false)

  const toggleModal = () => {
    setDeleteModal((prev) => !prev)
  }

  const deleteCoordi = () => {
    // 삭제 기능 추가 필요
  }

  return (
    <>
      <HeaderWithBackward title="코디북" />
      <Image
        src={coordinate.image}
        alt={params.id}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
      />
      <div className="m-4">
        <h1 className="text-xl font-semibold">{coordinate.name}</h1>
        <div className="my-4 flex gap-4">
          <OutlineButton>
            <IoPencil className="text-primary-400" />
            <span className="ms-2 text-sm">코디 수정하기</span>
          </OutlineButton>
          <OutlineButton>
            <MdOutlineShare className="text-primary-400" />
            <span className="ms-2 text-sm">커뮤니티에 공유하기</span>
          </OutlineButton>
        </div>
        <div className="my-10">
          <h4 className="font-semibold">스타일 태그</h4>
          <div className="my-2 flex flex-wrap gap-2">
            {coordinate.styles.map((style) => (
              <TagButton key={style} isSelected>
                # {style}
              </TagButton>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">코디에 사용된 아이템</h4>
          <div className="h-32 flex gap-4 my-2">
            {coordinate.items.map((item, index) => (
              <Link href={`/closet/modify/${item.id}`} key={item.id}>
                <Image
                  src={item.image}
                  alt={`Item-${index}`}
                  width={0}
                  height={0}
                  sizes="100%"
                  className="w-auto h-full object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div
          className="sticky bottom-[88px] float-right me-8 flex items-center justify-center bg-secondary rounded-full w-[60px] h-[60px] border border-primary-400 hover:bg-primary-400 group"
          onClick={toggleModal}
          role="presentation"
          aria-hidden="true"
        >
          <HiTrash
            className="text-primary-400 group-hover:text-secondary"
            size={20}
          />
        </div>
        {deleteModal && (
          <ConfirmModal
            message={
              <div>
                <p>코디를 코디북에서</p>
                <p>제거하시겠습니까?</p>
              </div>
            }
            messageClassName="text-base"
            onClose={toggleModal}
            onConfirm={deleteCoordi}
          />
        )}
      </div>
    </>
  )
}
