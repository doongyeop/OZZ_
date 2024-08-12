import { getFavoriteApi } from './authApi'
import {
  FavoriteGroupCreateRequest,
  FavoriteListDeleteRequest,
} from '../types/favorite/data-contracts'

// 즐겨찾기 그룹 생성 함수
export const createFavoriteGroup = async (
  requestData: FavoriteGroupCreateRequest,
) => {
  const favoriteApi = getFavoriteApi()
  const response = await favoriteApi.createFavoriteGroup(requestData)
  return response
}

// 즐겨찾기 추가 함수
export const addFavorite = async (
  favoriteGroupId: number,
  coordinateId: number,
) => {
  const favoriteApi = getFavoriteApi()
  const response = await favoriteApi.addFavorite(favoriteGroupId, coordinateId)
  return response
}

// 즐겨찾기 그룹에서 특정 코디 삭제 함수
export const deleteFavorite1 = async (
  favoriteGroupId: number,
  coordinateId: number,
) => {
  const favoriteApi = getFavoriteApi()
  const response = await favoriteApi.deleteFavorite1(
    favoriteGroupId,
    coordinateId,
  )
  return response
}

// 특정 즐겨찾기 그룹의 코디 목록 조회 함수
export const getFavoritesByGroup = async (favoriteGroupId: number) => {
  const favoriteApi = getFavoriteApi()
  const response = await favoriteApi.getFavoritesByGroup(favoriteGroupId)
  return response
}

// 특정 즐겨찾기 그룹 삭제 함수
export const deleteFavoriteGroup = async (favoriteGroupId: number) => {
  const favoriteApi = getFavoriteApi()
  const response = await favoriteApi.deleteFavoriteGroup(favoriteGroupId)
  return response
}

// 내 즐겨찾기 그룹 목록 조회 함수
export const getFavoritesGroupListOfUsers = async () => {
  const favoriteApi = getFavoriteApi()
  const response = await favoriteApi.getFavoritesGroupListOfUsers()
  const data = await response.data
  return data
}

// 즐겨찾기 그룹에서 여러 코디를 삭제 함수
export const deleteFavorite = async (
  favoriteGroupId: number,
  data: FavoriteListDeleteRequest,
) => {
  const favoriteApi = getFavoriteApi()
  const response = await favoriteApi.deleteFavorite(favoriteGroupId, data)
  return response
}
