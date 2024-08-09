'use client'

import { useState, ReactNode, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Modal from '@/components/Modal'
import UploadModal from './modal'
import { HiPencil } from 'react-icons/hi'
import { FaUser } from 'react-icons/fa6'
import { Api as FileApi } from '@/types/file/Api'
import { Api as AuthApi } from '@/types/auth/Api'
import { Api as UserApi } from '@/types/user/Api'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNCIsImlhdCI6MTcyMzE2NzQ5NSwiZXhwIjoxNzIzMjI3NDk1fQ.88TdF66wvJ9jNoBH8k1dpOsgonu0QzyHWqRoxs0iNnc'

const fileApi = new FileApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

const authApi = new AuthApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

const userApi = new UserApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

interface FieldProps {
  label: string
  id: string
  children: ReactNode
}

function Field({ label, id, children }: FieldProps) {
  return (
    <div className="w-full text-sm font-medium">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  )
}

function ProfileEdit() {
  const [user, setUser] = useState<any>({})
  const [profileModal, setProfileModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [uploadModal, setUploadModal] = useState(false)

  async function getUser() {
    const response = await userApi.getUserInfo()
    const data = await response.json()
    console.log('data', data)
    setUser(data)
  }

  useEffect(() => {
    getUser()
  }, [])

  const toggleProfileModal = useCallback(() => {
    if (profileModal) {
      setUploadModal(false)
    }
    setProfileModal((prev) => !prev)
  }, [profileModal])

  const toggleDeleteModal = useCallback(() => {
    setDeleteModal((prev) => !prev)
  }, [])

  const toggleUploadModal = useCallback(() => {
    setUploadModal((prev) => !prev)
  }, [])

  const resetProfilePic = useCallback(() => {
    setUser((prev: any) => ({
      ...prev,
      profile_file_id: null,
    }))
  }, [])

  const handleResetProfilePic = useCallback(() => {
    resetProfilePic()
    toggleProfileModal()
  }, [resetProfilePic, toggleProfileModal])

  return (
    <div className="relative w-full min-h-screen max-w-[360px] mx-auto flex flex-col items-center">
      {/* Profile Image Section */}
      <div className="w-full flex flex-col items-center space-y-4 mb-12">
        <div className="relative w-[100px] h-[100px]">
          {user.profile_file_id ? (
            <Image
              src={user.profile_file_id}
              alt="프로필 이미지"
              layout="fill"
              className="rounded-full"
            />
          ) : (
            <FaUser className="rounded-full fill-gray-300 w-full h-full" />
          )}
        </div>
        <button
          type="button"
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
              <button
                type="button"
                onClick={toggleUploadModal}
                className="text-left"
              >
                사진 올리기
              </button>
              <button
                type="button"
                onClick={handleResetProfilePic}
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
            value={user?.email || ''}
            readOnly
            className="mt-1 block w-full px-3 py-2 rounded text-[#CCCED0] focus:outline-none text-xs font-medium bg-gray-light cursor-not-allowed h-[30px]"
          />
        </Field>

        <Field label="닉네임" id="nickname">
          <div className="relative text-xs font-medium group">
            <input
              id="nickname"
              type="text"
              defaultValue={user?.nickname || ''}
              className="px-3 w-full block border border-[#ECECEE] rounded focus:outline-none focus:ring-none h-[30px] group-hover:border-primary-400"
            />
            <div className="absolute inset-y-0 end-0 flex items-center pr-3">
              <HiPencil className="fill-gray-300 w-3.5 h-3.5 group-hover:fill-primary-400" />
            </div>
          </div>
        </Field>
      </div>
      <button
        type="button"
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
                type="button"
                onClick={toggleDeleteModal}
                className="border border-primary-400 rounded-full hover:bg-primary-400 hover:text-secondary px-4 py-1"
              >
                취소
              </button>
              <button
                type="button"
                // onClick={deleteUser}
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

export default ProfileEdit
