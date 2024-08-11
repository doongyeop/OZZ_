/* eslint-disable @typescript-eslint/no-use-before-define */

import { QueryClient } from '@tanstack/react-query'
import { Api as AuthApi } from '@/types/auth/Api'
import cookie from 'cookie'

const API_URL = 'http://i11a804.p.ssafy.io:8080'

export const queryClient = new QueryClient()

export interface Tokens {
  accessToken: string
  refreshToken: string
}

let authApi: AuthApi<Tokens> | null = null

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
  console.log('토큰 가져오자')
  const cookieString = document.cookie
  const cookies = cookie.parse(cookieString)
  console.log('cookies: ', cookies)

  const accessToken = cookies.access || ''
  const refreshToken = cookies.refresh || ''

  if (accessToken && refreshToken) {
    const tokens: Tokens = { accessToken, refreshToken }
    queryClient.setQueryData(['tokens'], tokens)
    initializeApi(tokens)
  } else {
    console.log('토큰이 존재하지 않습니다.')
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
