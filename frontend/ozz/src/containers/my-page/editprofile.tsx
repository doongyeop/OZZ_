'use client'
import React, { useState } from 'react'
import { DatePicker } from '@/components/Datepicker'
import Modal from '@/components/Modal/Modal'
import UploadModal from './modal'

const ProfileEdit = () => {
  const [user, setUser] = useState({
    birth: '1998-12-07',
    nickname: '까미언니',
    email: 'kkamisister1207@gmail.com',
    profile_file_id: 'https://cdn2.thecatapi.com/images/2nk.jpg',
  })

  const [profileModal, setProfileModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [uploadModal, setUploadModal] = useState(false)

  function toggleProfileModal() {
    if (profileModal) {
      setUploadModal(false) // ProfileModal이 닫힐 때 UploadModal도 닫기
    }
    setProfileModal((prev) => !prev)
  }

  function toggleDeleteModal() {
    setDeleteModal((prev) => !prev)
  }

  function toggleUploadModal() {
    setUploadModal((prev) => !prev)
  }

  function resetProfilePic() {
    setUser((prev) => ({
      ...prev,
      profile_file_id: null,
    }))
  }

  const deleteUser = () => {
    // 회원 탈퇴 로직 추가
    console.log('회원 탈퇴 처리')
  }

  return (
    <div className="relative w-full min-h-screen max-w-[360px] mx-auto flex flex-col items-center">
      {/* Profile Image Section */}
      <div className="w-full flex flex-col items-center space-y-4 mb-12">
        {user.profile_file_id ? (
          <img
            src={user.profile_file_id}
            alt="프로필 이미지"
            className="w-[100px] h-[100px] rounded-full"
          />
        ) : (
          <svg
            width="100"
            height="100"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[100px] h-[100px] rounded-full"
          >
            <path
              d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z"
              className="fill-gray-300"
            />
            <path
              d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z"
              className="fill-gray-300"
            />
          </svg>
        )}
        <button
          onClick={toggleProfileModal}
          className="w-32 mt-2 px-4 py-2 border border-primary-400 text-xs font-medium rounded h-[30px] flex items-center justify-center hover:bg-primary-400 hover:text-white"
        >
          프로필 이미지 변경
        </button>
        {profileModal && (
          <Modal
            title="프로필 이미지 변경"
            onClose={toggleProfileModal}
            className="overflow-visible"
          >
            <div className="relative text-sm text-white flex flex-col space-y-4 px-3">
              <button onClick={toggleUploadModal} className="text-left">
                사진 올리기
              </button>
              <button
                onClick={() => {
                  resetProfilePic()
                  toggleProfileModal()
                }}
                className="text-left"
              >
                기본 이미지로 변경
              </button>
              {uploadModal && <UploadModal onClose={toggleUploadModal} />}
            </div>
          </Modal>
        )}
      </div>

      {/* User Information Section */}
      <div className="flex flex-col items-center w-full space-y-4">
        <Field label="이메일" id="email">
          <input
            id="email"
            type="text"
            value={user.email}
            readOnly
            className="mt-1 block w-full px-3 py-2 rounded text-[#CCCED0] focus:outline-none text-xs font-medium bg-gray-light cursor-not-allowed h-[30px]"
          />
        </Field>

        <Field label="닉네임" id="nickname">
          <div className="relative text-xs font-medium">
            <input
              id="nickname"
              type="text"
              defaultValue={user.nickname}
              className="px-3 w-full block border border-[#ECECEE] rounded focus:outline-none focus:ring-none h-[30px] hover:border-primary-400"
            />
            <div className="absolute inset-y-0 end-0 flex items-center pr-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                  fill="#CCCED0"
                />
                <path
                  d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                  fill="#CCCED0"
                />
              </svg>
            </div>
          </div>
        </Field>

        <Field label="생년월일" id="birth">
          <DatePicker
            defaultValue={user.birth}
            buttonClassName="w-[360px] text-xs font-medium border-[#ECECEE] h-[30px] rounded hover:border-primary-400"
          />
        </Field>
      </div>
      <button
        onClick={toggleDeleteModal}
        className="text-xs absolute bottom-8 w-full border border-[#DB6262] text-[#DB6262] h-[30px] flex items-center justify-center rounded px-2 py-1"
      >
        회원 탈퇴
      </button>
      {deleteModal && (
        <Modal onClose={toggleDeleteModal}>
          <div className="space-y-5 text-center mb-1">
            <p className="text-primary-400 text-base font-bold">
              탈퇴하시겠습니까?
            </p>
            <div className="text-xs text-white space-y-4">
              <p>탈퇴한 회원 정보는 복구할 수 없습니다.</p>
              <p>커뮤니티에 올린 코디샷은 자동으로 삭제되지 않습니다.</p>
            </div>
            <div className="space-x-4 text-primary-400 text-sm flex justify-center font-bold">
              <button
                onClick={toggleDeleteModal}
                className="border border-primary-400 rounded-full hover:bg-primary-400 hover:text-secondary px-4 py-1"
              >
                취소
              </button>
              <button
                onClick={deleteUser}
                className="border border-primary-400 rounded-full hover:bg-primary-400 hover:text-secondary px-4 py-1"
              >
                확인
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

const Field = ({ label, id, children }) => (
  <div className="w-full text-sm font-medium">
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
)

export default ProfileEdit
