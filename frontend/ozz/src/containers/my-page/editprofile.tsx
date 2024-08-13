'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, ReactNode, useCallback, useEffect } from 'react'
import { UserUpdateRequest } from '@/types/user/data-contracts'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { HiPencil } from 'react-icons/hi'
import { FaUser } from 'react-icons/fa6'
import DatePicker from '@/components/Datepicker'
import Modal from '@/components/Modal'
import {
  getUserInfo,
  updateUser,
  deleteUser,
  checkNickname,
  deleteProfileImage,
  uploadProfileImage,
} from '@/services/userApi'
import { getFile, downloadFile } from '@/services/fileApi'
import { syncTokensWithCookies } from '@/services/authApi'
import UploadModal from './modal'

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
  const [user, setUser] = useState<User | null>(null)
  const [profileModal, setProfileModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [uploadModal, setUploadModal] = useState(false)
  const [profileSrc, setProfileSrc] = useState('')
  const [errorText, setErrorText] = useState('')
  const [nickname, setNickname] = useState('')
  const [birthday, setBirthday] = useState<Date | null>(null)

  const router = useRouter()

  const getProfilePic = async (picId: number) => {
    try {
      const fileData = await getFile(picId)
      // console.log('getFile 성공', fileData)
      const picture = await downloadFile(fileData.filePath)
      // console.log('downloadFile 성공', picture)
      if (picture !== undefined) {
        const pictureUrl = URL.createObjectURL(picture)
        setProfileSrc(pictureUrl)
      }
    } catch (error) {
      console.log('프로필사진 가져오는 중 오류 발생:', error)
    }
  }

  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfo()
      setUser(userInfo)
      setErrorText('') // responseText 초기화
      if (userInfo.profileFileId) {
        await getProfilePic(userInfo.profileFileId)
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  }

  useEffect(() => {
    syncTokensWithCookies()
    fetchUserInfo()
  }, [])

  const checkNicknameDuplication = async (nick: string): Promise<boolean> => {
    if (nick.length > 15 || nick.length <= 0) {
      setErrorText('닉네임은 1-15자 이내여야 합니다')
      return false
    }
    if (nick.includes(' ')) {
      setErrorText('공백은 사용 불가능합니다')
      return false
    }

    try {
      const response = await checkNickname(nick)
      if (response === '사용 가능한 닉네임입니다.') {
        setErrorText('')
        return true
      }
      setErrorText('이미 사용 중인 닉네임입니다')
      return false
    } catch (error) {
      setErrorText('닉네임 확인 중 오류가 발생했습니다.')
      return false
    }
  }

  const saveUserInfo = async () => {
    try {
      // 닉네임이 변경되지 않은 경우 중복 확인을 건너뜀
      if (user?.nickname !== nickname) {
        const isNicknameAvailable = await checkNicknameDuplication(nickname)

        if (!isNicknameAvailable) {
          return false
        }
      }

      const userData: UserUpdateRequest = {
        nickname,
        birth: birthday?.toISOString() || '', // ISO 형식으로 변환
      }

      await updateUser(userData)
      await fetchUserInfo() // 유저 정보 다시 불러오기
      return true
    } catch (error) {
      console.log('회원정보 수정 안 됨', error)
      return false
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

  const resetProfilePic = async () => {
    if (user?.profileFileId) {
      try {
        await deleteProfileImage()
        console.log('프로필 삭제지우는즁')
        await fetchUserInfo()
      } catch (err) {
        console.log('프로필 사진 삭제 실패:', err)
      }
    }
  }

  const handleResetProfilePic = useCallback(async () => {
    await resetProfilePic()
    setProfileModal(false)
  }, [resetProfilePic])

  const handleFileSelect = async (file: File) => {
    try {
      const response = await uploadProfileImage(file)
      console.log('프로필 이미지 업로드 성공:', response)
      await fetchUserInfo() // 업로드 성공 후 유저 정보 다시 불러오기
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error)
    }
  }

  const handleUploadSuccess = useCallback(async () => {
    await fetchUserInfo() // 유저 정보 다시 불러오기
    toggleProfileModal()
  }, [])

  const deleteAccount = () => {
    deleteUser()
    router.push('/login')
  }

  return (
    <div className="relative w-full max-w-[360px] mx-auto flex flex-col items-center">
      {/* Profile Image Section */}
      <div className="w-full flex flex-col items-center space-y-4 mb-12">
        <div className="relative w-[100px] h-[100px]">
          {profileSrc ? (
            <Image
              src={profileSrc}
              alt="프로필 이미지"
              style={{ aspectRatio: '1 / 1' }}
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
              {uploadModal && (
                <UploadModal
                  onClose={toggleUploadModal}
                  onFileSelect={handleFileSelect} // 파일 선택 시 업로드 처리
                />
              )}
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
            {errorText && (
              <span className="text-xs text-red-500">{errorText}</span>
            )}
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
                onClick={deleteAccount}
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
