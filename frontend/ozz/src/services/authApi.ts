/* eslint-disable @typescript-eslint/no-use-before-define */

import { QueryClient } from '@tanstack/react-query'
import { Api as AuthApi } from '@/types/auth/Api'

const API_URL = 'http://i11a804.p.ssafy.io:8080'

export const queryClient = new QueryClient()

export interface Tokens {
  accessToken: string
  refreshToken: string
}

let authApi: AuthApi<Tokens> | null = null

export const fetchTokensFromServer = async (): Promise<Tokens | null> => {
  try {
    const response = await fetch('/api/authTokens', {
      method: 'GET',
      credentials: 'include',
    })
    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    if (response.ok) {
      const tokens = await response.json()
      console.log('토큰 : ', tokens)
      return tokens
    }
    console.error('Failed to fetch tokens:', response.statusText)
    const errorText = await response.text()
    console.error('Error details:', errorText)
    return null
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return null
  }
}

export const getTokens = (): Tokens | undefined => {
  const tokens = queryClient.getQueryData<Tokens>(['tokens'])
  if (tokens) initializeApi(tokens) // 가져올 때마다 초기화
  return tokens
}

export const initializeApi = (tokens: Tokens) => {
  if (!authApi || tokens.accessToken !== getTokens()?.accessToken) {
    authApi = new AuthApi<Tokens>({
      baseUrl: API_URL,
      securityWorker: async () => ({
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }),
    })
  }
}

export const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return matches ? decodeURIComponent(matches[1]) : undefined
}

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/;`
}

// 쿠키와 react-query 상태를 동기화하는 함수
export const syncTokensWithCookies = async () => {
  console.log('토큰 가져가러 감')
  const tokens = await fetchTokensFromServer()

  if (tokens) {
    queryClient.setQueryData(['tokens'], tokens)
    initializeApi(tokens)
  }
}

export const removeTokens = () => {
  removeCookie('access')
  removeCookie('refresh')
  queryClient.removeQueries({ queryKey: ['tokens'] })
  authApi = null
}

export const login = async (provider: 'kakao' | 'naver') => {
  window.location.href = `${API_URL}/oauth2/authorization/${provider}`
}

export const handleLoginCallback = async () => {
  // 여기서는 백엔드에서 제공하는 콜백 처리 엔드포인트를 호출해야 합니다.
  syncTokensWithCookies()
  return getTokens()
}

export const reissueToken = async () => {
  if (!authApi) throw new Error('API not initialized')
  try {
    const response = await authApi.reissue()
    const newTokens = response.data as Tokens

    queryClient.setQueryData(['tokens'], newTokens)
    initializeApi(newTokens)
    return newTokens
  } catch (error) {
    console.error('Token reissue failed', error)
    removeTokens() // 토큰이 만료되었거나 재발급에 실패하면 토큰 제거
    throw error
  }
}

export const logout = async (userId: number) => {
  if (!authApi) throw new Error('API not initialized')
  await authApi.deleteRefreshTokenOfUser(userId)
  removeTokens()
}
