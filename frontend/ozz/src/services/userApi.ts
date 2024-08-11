// services/userApi.ts
import { QueryClient } from '@tanstack/react-query'
import { Api as UserApi } from '@/types/user/Api'
import {
  UserUpdateRequest,
  UploadProfileImagePayload,
} from '@/types/user/data-contracts'
import {
  Tokens,
  getTokens,
  removeTokens,
  syncTokensWithCookies,
} from './authApi'

const API_URL = 'http://i11a804.p.ssafy.io:8080'

export const queryClient = new QueryClient()

let userApi: UserApi<Tokens> | null = null

export const initializeUserApi = (tokens: Tokens) => {
  if (!userApi || tokens.accessToken !== getTokens()?.accessToken) {
    userApi = new UserApi<Tokens>({
      baseUrl: API_URL,
      securityWorker: async () => ({
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }),
    })
  }
}

// 쿠키에서 토큰을 가져와 userApi 초기화
export const syncUserApiWithCookies = () => {
  syncTokensWithCookies() // 쿠키에서 토큰을 가져오고, 초기화.
  const tokens = getTokens()
  console.log('syncUserApiWithCookies 호출', tokens)
  if (tokens && !userApi) {
    // userApi가 아직 초기화되지 않은 경우에만 초기화.
    initializeUserApi(tokens)
  }
}

export const getUserInfo = async () => {
  console.log('getUserInfo 실행')
  syncUserApiWithCookies()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.getUserInfo()
  console.log('response :', response.json())
  return response.json()
}

export const updateUser = async (data: UserUpdateRequest) => {
  syncUserApiWithCookies()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.updateUser(data)
  return response.json()
}

export const deleteUser = async () => {
  syncUserApiWithCookies()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.deleteUser()
  removeTokens() // Logout after deleting the user
  return response.data
}

export const uploadProfileImage = async (file: File) => {
  syncUserApiWithCookies()
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
  syncUserApiWithCookies()
  if (!userApi) throw new Error('User API not initialized')
  const response = await userApi.checkNickname({ nickname })
  return response.text()
}
