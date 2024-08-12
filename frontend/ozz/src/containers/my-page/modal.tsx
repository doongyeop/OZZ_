/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'
import { HiPhotograph, HiFolder } from 'react-icons/hi'

interface UploadModalProps {
  onClose: () => void
}

export default function UploadModal({ onClose }: UploadModalProps) {
  return (
    <div className="absolute left-[60%] top-0 z-50 bg-gray-50 border border-gray-300 rounded-lg p-4 w-36 mt-8 mr-[-1rem] text-black">
      <div className="w-full h-full text-sm flex flex-col space-y-4 px-3">
        <button
          type="button"
          className="flex items-center justify-between w-full text-left"
        >
          사진 보관함
          <HiPhotograph />
        </button>
        <div className="border-t border-gray-300" />
        <button
          type="button"
          className="flex items-center justify-between w-full text-left"
        >
          파일 선택
          <HiFolder />
        </button>
      </div>
    </div>
  )
}
