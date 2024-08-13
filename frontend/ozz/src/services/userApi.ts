// services/userApi.ts

import {
  UserUpdateRequest,
  UploadProfileImagePayload,
} from '@/types/user/data-contracts'
import { getUserApi, removeTokens } from './authApi'

export const getUserInfo = async () => {
  const userApi = getUserApi()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.getUserInfo()
  const userInfo = await response.json()
  return userInfo
}

export const updateUser = async (data: UserUpdateRequest) => {
  const userApi = getUserApi()
  // console.log(
  //   'User API updateUser 호출 시 사용된 토큰:',
  //   getTokens()?.accessToken,
  // )

  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.updateUser(data)
  // console.log('response: ', response)
  const userInfo = await response.json()
  // console.log('userInfo: ', userInfo)
  return userInfo
}

export const deleteUser = async () => {
  const userApi = getUserApi()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.deleteUser()
  removeTokens() // Logout after deleting the user
  return response.data
}

export const uploadProfileImage = async (file: File) => {
  const userApi = getUserApi()
  if (!userApi) throw new Error('User API not initialized')
  // const formData = new FormData()
  // formData.append('file', file)
  const payload: UploadProfileImagePayload = {
    file,
  }
  const response = await userApi.uploadProfileImage(payload)
  // const response = await userApi.uploadProfileImage(formData)
  return response.data
}

export const checkNickname = async (nickname: string) => {
  const userApi = getUserApi()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.checkNickname({ nickname })
  return response.text()
}

export async function deleteProfile() {
  const apiUrl = 'https://i11a804.p.ssafy.io/api/users/'

  // 쿠키에서 AccessToken 가져오기
  const accessToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1]

  if (!accessToken) {
    throw new Error('AccessToken이 존재하지 않습니다.')
  }

  try {
    console.log('deleteProfile 프로필사진 지우기 시도는 했어요~~~')
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status !== 204) {
      console.log('클남;; 프로필 삭제 안됨;;;')
      throw new Error('프로필 삭제 실패')
    }

    const data = await response.json()
    console.log('와와 지워졌다 와와!!!!!!!')
    return data
  } catch (error) {
    console.error('프로필 삭제 중 오류 발생:', error)
    throw error
  }
}
