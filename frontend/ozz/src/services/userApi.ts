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

export const deleteProfileImage = async () => {
  const userApi = getUserApi()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.deleteProfileImage()
  console.log('deleteProfile에 대한 response는요', response)
  return response.status
}
