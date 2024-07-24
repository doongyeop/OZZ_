'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CameraIcon from '../../../public/icons/camera.svg'
import PencilIcon from '../../../public/icons/pencil.svg'
import BrandModal from '@/app/@modal/brand/page' // Adjust imports based on your directory structure

// export default function Form({clothes} : {clothes: ClothesField}) {
export default function Form() {
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [brandName, setBrandName] = useState<string>('')

  const closeModal = () => setOpenModal(null)

  const modalItems = [
    {
      label: '브랜드',
      path: 'brand',
      component: BrandModal,
      value: brandName,
      setValue: setBrandName,
    },
    { label: '카테고리', path: 'category' },
    { label: '구매일자', path: 'purchase-date' },
    { label: '구매처', path: 'purchase-place' },
    { label: '계절감', path: 'season' },
    { label: '사이즈', path: 'size' },
    { label: '핏', path: 'fit' },
    { label: '소재', path: 'material' },
    { label: '색', path: 'color' },
    { label: '스타일', path: 'style' },
    { label: '패턴', path: 'pattern' },
    { label: '메모', path: 'memo' },
  ]

  return (
    <div className="py-32 px-10 min-h-screen flex flex-col justify-center items-center">
      <form action="">
        <div className="flex justify-center mb-3">
          <input type="file" name="image" id="image" className="sr-only" />
          <label
            htmlFor="image"
            className="relative flex min-h-[300px] min-w-[300px] items-center justify-center rounded-lg border border-secondary p-12 text-center"
          >
            <div>
              <Image
                src={CameraIcon}
                alt="camera"
                width={100}
                className="opacity-50"
              />
              <span className="mb-2 block text-sm font-semibold text-[#000000] opacity-20">
                옷 이미지 등록
              </span>
            </div>
          </label>
        </div>
        <div className="bg-secondary p-5 max-w-[300px] rounded-lg">
          <div className="flex items-center mb-5 ">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="이름 입력"
              autoComplete="off"
              className="flex-1 py-2 text-center bg-secondary font-extrabold text-lg
                    text-primary-400 placeholder:text-gray-light outline-none"
            />
          </div>

          {/* Form */}
          <div className="w-full max-w-md text-gray-light rounded-lg shadow-md space-y-2 mb-4">
            {modalItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-[#000000] border-opacity-30 py-2"
              >
                <span>{item.label}</span>

                <div>
                  {item.value && (
                    <span className="text-primary-400 mr-2">{item.value}</span>
                  )}
                  <button
                    onClick={() => setOpenModal(item.path)}
                    className=""
                    type="button"
                  >
                    {/* <Image src={PencilIcon} alt="pencil" width={20} /> */}+
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center align-middle">
            <button className="px-8 w-[180px] h-[40px] bg-primary-400 align-middle rounded-3xl text-secondary text-md font-bold">
              등록하기
            </button>
          </div>

          {/* Modals */}
          {modalItems.map(
            ({ path, component: ModalComponent, setValue }) =>
              openModal === path && (
                <ModalComponent
                  key={path}
                  onClose={closeModal}
                  setValue={setValue}
                />
              ),
          )}
        </div>
      </form>
    </div>
  )
}
