// services/userApi.ts
import { QueryClient } from '@tanstack/react-query'
import {
  UserUpdateRequest,
  UploadProfileImagePayload,
} from '@/types/user/data-contracts'
import { Api as UserApi } from '@/types/user/Api'
import {
  Tokens,
  getTokens,
  removeTokens,
  syncTokensWithCookies,
} from './authApi' // Assuming authApi.ts manages tokens

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

export const setUserTokens = (tokens: Tokens) => {
  // Assuming setTokens is defined in authApi to manage tokens
  initializeUserApi(tokens)
}

export const getUserTokens = (): Tokens | undefined => {
  return getTokens() // Assuming getTokens is defined in authApi to retrieve tokens
}

export const removeUserTokens = () => {
  removeTokens() // Assuming removeTokens is defined in authApi to remove tokens
  userApi = null
}

// 다른 API 호출 함수들 (getUserInfo, updateUser, checkNickname 등)

// 쿠키에서 토큰을 가져와 userApi 초기화
export const syncUserApiWithCookies = () => {
  syncTokensWithCookies() // authApi의 syncTokensWithCookies 함수 호출
  const tokens = getTokens()
  if (tokens) {
    initializeUserApi(tokens)
  }
}

export const getUserInfo = async () => {
  console.log('getUserInfo 실행')
  syncUserApiWithCookies()
  if (!userApi) throw new Error('User API not initialized')
  console.log('userApi :', userApi)
  const response = await userApi.getUserInfo()
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
  removeUserTokens() // Logout after deleting the user
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
