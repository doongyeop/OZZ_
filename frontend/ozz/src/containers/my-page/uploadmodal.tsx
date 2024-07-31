import React from 'react'

interface UploadModalProps {
  onClose: () => void
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
  return (
    <div className="fixed z-50 inset-y-0 right-0 flex items-center bg-[#F6F6F9] bg-opacity-0">
      <div className="bg-[#F6F6F9] rounded-lg px-4 py-2 max-w-36 w-full mx-auto">
        <div className="text-right">
          <button onClick={onClose} className="text-xl" aria-label="Close">
            &times;
          </button>
        </div>
        <div className="text-sm flex flex-col space-y-4 px-3">
          <button className="flex items-center justify-between w-full text-left">
            사진 보관함
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 3C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V5C18 3.89543 17.1046 3 16 3H4ZM16 15H4L8 7L11 13L13 9L16 15Z"
                fill="#111827"
              />
            </svg>
          </button>
          <button className="flex items-center justify-between w-full text-left">
            파일 선택
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H16C17.1046 6 18 6.89543 18 8V14C18 15.1046 17.1046 16 16 16H4C2.89543 16 2 15.1046 2 14V6Z"
                fill="#111827"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
