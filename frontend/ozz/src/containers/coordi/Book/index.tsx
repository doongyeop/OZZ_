'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { HiPencil, HiPlus } from 'react-icons/hi'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import Modal from '@/components/Modal'
import { Coordibook } from '@/types/coordibook'
import { getUserInfo } from '@/services/userApi'
import {
  createFavoriteGroup,
  getFavoritesGroupListOfUsers,
} from '@/services/favoriteApi'

export default function CoordiBook() {
  const [createModal, setCreateModal] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  // const [user, setUser] = useState()
  const [groups, setGroups] = useState<Coordibook[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchFavoritesGroupList = async () => {
      try {
        const response = await getFavoritesGroupListOfUsers()
        console.log(response)
        setGroups(response)
      } catch (error) {
        console.error('Error fetching favorites data:', error)
      }
    }
    fetchFavoritesGroupList()
  }, [])

  const goToCoordiBook = (id: number, name: string) => {
    router.push(`/coordi/book/${id}?name=${encodeURIComponent(name)}`)
  }

  const closeModal = () => {
    setCreateModal(false)
  }

  async function createCoordiBook() {
    if (!newGroupName) {
      alert('그룹 이름을 입력하세요')
      return
    }

    closeModal()

    const requestData = { name: newGroupName }
    try {
      const response = await createFavoriteGroup(requestData)
      console.log(response)
      setNewGroupName('')
      // 코디북 생성 후 즐겨찾기 목록 다시 불러오기
      const updatedGroups = await getFavoritesGroupListOfUsers()
      setGroups(updatedGroups)
      closeModal()
    } catch (error) {
      console.error('코디북 생성 중 오류 발생:', error)
    }
  }

  const getFavGrp = (group: Coordibook) => {
    return (
      <div key={group.favoriteGroupId} className="aspect-square">
        <Card
          className="flex items-center h-full overflow-hidden shadow-md"
          onClick={() => goToCoordiBook(group.favoriteGroupId, group.name)}
        >
          <CardContent
            className={`object-cover p-0 flex flex-wrap ${
              group.imageFileList && group.imageFileList.length >= 4
                ? 'w-full h-full'
                : ''
            }`}
          >
            {group.imageFileList && group.imageFileList.length > 0 ? (
              group.imageFileList.slice(0, 4).map((image) => (
                <div
                  key={image.fileId}
                  className={`${
                    group.imageFileList.length >= 4
                      ? 'w-1/2 h-1/2 overflow-hidden'
                      : 'h-full w-full'
                  }`}
                >
                  <img
                    src={image.filePath}
                    alt={image.fileName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="hidden">암것도 없어요</div>
            )}
          </CardContent>
        </Card>
        <CardTitle className="text-left text-black font-medium text-sm mt-2">
          {group.name}
        </CardTitle>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 m-4">
      <div className="aspect-square">
        <Card
          onClick={() => setCreateModal(true)}
          className="h-full bg-secondary flex items-center justify-center shadow-md"
        >
          <HiPlus className="w-8 h-8 fill-primary-400" />
        </Card>
        <CardTitle className="text-left text-black font-medium text-sm mt-2">
          <button type="button">새 코디북 생성</button>
        </CardTitle>
      </div>
      {groups.map((group) => (
        <div key={group.favoriteGroupId}>{getFavGrp(group)}</div>
      ))}
      {createModal && (
        <Modal title="코디북 이름" onClose={() => closeModal()}>
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="예시) 자주 입는 옷"
                className={`border border-primary-400 bg-secondary p-2 pl-10 w-full focus:outline-none text-right ${
                  inputFocused
                    ? 'text-primary-400'
                    : 'text-primary-400 text-opacity-30'
                }`}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <HiPencil className="w-5 h-5 fill-primary-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              type="button"
              onClick={createCoordiBook}
              className="px-3 py-1 mt-4 rounded-full text-sm text-primary-400 border border-primary-400 font-bold hover:text-secondary hover:bg-primary-400"
            >
              만들기
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
