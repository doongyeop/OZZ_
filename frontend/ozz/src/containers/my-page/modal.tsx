import React, { useRef } from 'react'
import { HiPhotograph, HiFolder } from 'react-icons/hi'
import { uploadProfileImage } from '@/services/userApi'

interface UploadModalProps {
  onClose: () => void
  onFileUploadSuccess: () => void
}

export default function UploadModal({
  onClose,
  onFileUploadSuccess,
}: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const response = await uploadProfileImage(file)
        console.log('프로필 이미지 업로드 성공:', response)
        onFileUploadSuccess() // 업로드 성공 후 콜백 호출
        onClose() // 업로드 후 모달 닫기
      } catch (error) {
        console.error('프로필 이미지 업로드 실패:', error)
      }
    }
  }

  return (
    <div className="absolute left-[60%] top-0 z-50 bg-gray-50 border border-gray-300 rounded-lg p-4 w-36 mt-8 mr-[-1rem] text-black">
      <div className="w-full h-full text-sm flex flex-col space-y-4 px-3">
        <button
          type="button"
          onClick={handleUploadClick}
          className="flex items-center justify-between w-full text-left"
        >
          사진 보관함
          <HiPhotograph />
        </button>
        <div className="border-t border-gray-300" />
        <button
          type="button"
          onClick={handleUploadClick}
          className="flex items-center justify-between w-full text-left"
        >
          파일 선택
          <HiFolder />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
