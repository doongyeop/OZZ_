/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useState, ReactNode, useCallback, useEffect } from 'react'
import { UserUpdateRequest } from '@/types/user/data-contracts'
import Image from 'next/image'
import { HiPencil } from 'react-icons/hi'
import { FaUser } from 'react-icons/fa6'
import DatePicker from '@/components/Datepicker'
import Modal from '@/components/Modal'
import UploadModal from './modal'
import {
  getUserInfo,
  updateUser,
  deleteUser,
  checkNickname,
} from '@/services/userApi'
import { getFile, downloadFile } from '@/services/fileApi'
import { syncTokensWithCookies } from '@/services/authApi'

interface FieldProps {
  label: string
  id: string
  children: ReactNode
}
interface User {
  email: string
  birth: Date
  createdDate?: Date
  nickname: string
  profileFileId?: number
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
  // const [user, setUser] = useState<User | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profileModal, setProfileModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [uploadModal, setUploadModal] = useState(false)
  const [profileSrc, setProfileSrc] = useState('')
  const [nickname, setNickname] = useState('')
  const [birthday, setBirthday] = useState<Date | null>(null)

  useEffect(() => {
    syncTokensWithCookies()
    const fetchUserInfo = async () => {
      try {
        await getUserInfo().then((userInfo) => {
          setUser(userInfo)
        })
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    }
    fetchUserInfo()
  }, [])

  const saveUserInfo = async () => {
    if ((await checkNickname(nickname)) === '사용 가능한 닉네임입니다.') {
      try {
        const userData: UserUpdateRequest = {
          nickname,
          birth: birthday?.toISOString() || '', // ISO 형식으로 변환
        }
        return true
      } catch (error) {
        console.log('회원정보 수정 안 됨', error)
        return false
      }
    } else {
      alert('닉네임사용불가')
      console.log('닉네임 수정 필요쓰')
    }
  }

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
    <div className="relative w-full max-w-[360px] mx-auto flex flex-col items-center">
      {/* Profile Image Section */}
      <div className="w-full flex flex-col items-center space-y-4 mb-12">
        <div className="relative w-[100px] h-[100px]">
          {profileSrc ? (
            <Image
              src={profileSrc}
              alt="프로필 이미지"
              fill
              className="rounded-full"
            />
          ) : (
            <FaUser className="rounded-full fill-gray-300 w-full h-full" />
          )}
        </div>
        <button
          type="button"
          onClick={toggleProfileModal}
          className="w-32 mt-2 px-4 py-2 border border-primary-400 text-xs font-medium rounded h-[30px] flex items-center justify-center hover:bg-primary-400"
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
              onChange={(e) => setNickname(e.target.value)}
              className="px-3 w-full block border border-[#ECECEE] rounded focus:outline-none focus:ring-none h-[30px] group-hover:border-primary-400"
            />
            <div className="absolute inset-y-0 end-0 flex items-center pr-3">
              <HiPencil className="fill-gray-300 w-3.5 h-3.5 group-hover:fill-primary-400" />
            </div>
          </div>
        </Field>

        <Field label="생일" id="birthday">
          <DatePicker
            defaultValue={
              user?.birth ? new Date(user.birth).toISOString() : undefined
            }
            buttonClassName=""
            onDateChange={(date) => setBirthday(date)}
          />
        </Field>
      </div>
      <div className="fixed bottom-0 w-full flex flex-col items-center space-y-2 p-4 mb-16 text-xs">
        <button
          type="button"
          onClick={saveUserInfo}
          className="border border-primary-400  hover:bg-primary-400  w-full max-w-[360px] h-[30px] rounded px-2 py-1"
        >
          확인
        </button>
        <button
          type="button"
          onClick={toggleDeleteModal}
          className="border border-[#DB6262] hover:bg-[#DB6262] text-[#DB6262] hover:text-black w-full max-w-[360px] h-[30px] flex items-center justify-center rounded px-2 py-1 "
        >
          회원 탈퇴
        </button>
      </div>

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

export default ProfileEdit
