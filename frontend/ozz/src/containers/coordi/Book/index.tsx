'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
// import { Api as ClothesApi } from '@/types/clothes/Api'
// import { Api as FavoriteApi } from '@/types/favorite/Api'
// import { Api as UserApi } from '@/types/user/Api'
// import { CreateFavoriteGroupData } from '@/types/favorite/data-contracts'
import Modal from '@/components/Modal'
import { HiPencil, HiPlus } from 'react-icons/hi'
import { Coordibook } from '@/types/coordibook'
// import { ImGift } from 'react-icons/im'
import { getUserInfo } from '@/services/userApi'
import { syncTokensWithCookies } from '@/services/authApi'
import {
  createFavoriteGroup,
  getFavoritesGroupListOfUsers,
} from '@/services/favoriteApi'

// interface Favorite {
//   favoriteId: number
//   coordinate: {
//     coordinateId: number
//     name: string
//     styleList: []
//     createdDate: string
//     imageFile: {
//       fileId: number
//       filePath: string
//       fileName: string
//       fileType: string
//     }
//   }
// }

// const token =
//   'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNyIsImlhdCI6MTcyMzQyMTY4MywiZXhwIjoxNzIzNDgxNjgzfQ.qYPB-IKzczSUxiJzlpF8z6U_MbpIaEmQC2PUG4vvkjk'

export default function CoordiBook() {
  const [createModal, setCreateModal] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  // const [user, setUser] = useState()
  const [groups, setGroups] = useState<Coordibook[]>([])
  // const [favorites, setFavorites] = useState<{ [key: number]: Favorite[] }>({})
  const router = useRouter()

  // /////////유저
  // const favApi = new FavoriteApi({
  //   securityWorker: async () => ({
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }),
  // })
  // const userApi = new UserApi({
  //   securityWorker: async () => ({
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   }),
  // })
  // async function getUser() {
  //   const res = await userApi.getUserInfo()
  //   const data = await res.json()
  //   setUser(data)
  // }
  //

  async function fetchGroups() {
    const res = await getFavoritesGroupListOfUsers()
    setGroups(res)
  }

  useEffect(() => {
    syncTokensWithCookies()
    const fetchUserInfo = async () => {
      try {
        await getUserInfo()
      } catch (error) {
        console.error('Failed to fetch user info:', error)
      }
    }
    fetchUserInfo()
    fetchGroups()
  }, [])
  // useEffect(() => {
  //   getUser()
  //   fetchGroups()
  // }, [])

  const goToCoordiBook = (id: number, name: string) => {
    router.push(`/coordi/book/${id}?name=${encodeURIComponent(name)}`)
  }

  const closeModal = () => {
    setCreateModal(false)
  }

  async function createCoordiBook() {
    if (!newGroupName) {
      alert('그룹이름을 입력하세요')
      return
    }

    closeModal()

    const requestData = { name: newGroupName }
    try {
      const response = await createFavoriteGroup(requestData)
      console.log(response)
      setNewGroupName('')
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
              group.imageFileList?.length >= 4 ? 'w-full h-full' : ''
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
