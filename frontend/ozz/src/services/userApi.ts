// services/userApi.ts

import {
  UserUpdateRequest,
  UploadProfileImagePayload,
} from '@/types/user/data-contracts'
import { getUserApi, removeTokens } from './authApi'

export const getUserInfo = async () => {
  console.log('getUserInfo 실행')
  const userApi = getUserApi()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.getUserInfo()
  console.log('response :', response.json())
  return response.json()
}

export const updateUser = async (data: UserUpdateRequest) => {
  const userApi = getUserApi()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.updateUser(data)
  return response.json()
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
  // const formData = new FormData();
  // formData.append('file', file);
  const payload: UploadProfileImagePayload = {
    file,
  }
  const response = await userApi.uploadProfileImage(payload)
  return response.data
}

export const checkNickname = async (nickname: string) => {
  const userApi = getUserApi()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.checkNickname({ nickname })
  return response.text()
}
