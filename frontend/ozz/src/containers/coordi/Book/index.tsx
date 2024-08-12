'use client'

import { use, useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
// import { Api as ClothesApi } from '@/types/clothes/Api'
import { Api as FavoriteApi } from '@/types/favorite/Api'
import { Api as UserApi } from '@/types/user/Api'
import Modal from '@/components/Modal'
import { HiPencil, HiPlus } from 'react-icons/hi'
import {
  Coordibook,
  mockCoordibooks,
  mockFavoriteDetails,
} from '@/types/coordibook'

interface FavoriteGroupCreateRequest {
  name: string
}

interface Favorite {
  favoriteGroupId: number
  name: string
  imageFileList: [
    {
      fileId: number
      filePath: string
      fileName: string
      fileType: string
    },
  ]
}

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNyIsImlhdCI6MTcyMzQyMTY4MywiZXhwIjoxNzIzNDgxNjgzfQ.qYPB-IKzczSUxiJzlpF8z6U_MbpIaEmQC2PUG4vvkjk'

export default function CoordiBook() {
  const [createModal, setCreateModal] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [user, setUser] = useState()
  const [groups, setGroups] = useState<Coordibook[]>([])
  const router = useRouter()
  const favApi = new FavoriteApi({
    securityWorker: async () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  })
  const userApi = new UserApi({
    securityWorker: async () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  })
  async function getUser() {
    const res = await userApi.getUserInfo()
    const data = await res.json()
    setUser(data)
  }
  useEffect(() => {
    getUser()
    fetchGroups()
  }, [])

  async function fetchGroups() {
    const res = await favApi.getFavoritesGroupListOfUsers()
    const data = await res.json()
    setGroups(data)
  }

  const goToCoordiBook = (id: number, name: string) => {
    router.push(`/coordi/book/${id}?name=${encodeURIComponent(name)}`)
  }

  async function createCoordiBook() {
    if (newGroupName.trim() === '') {
      alert('그룹이름을 입력하세요')
      return
    }

    const requestData = { name: newGroupName }
    try {
      const response = await favApi.createFavoriteGroup(requestData)
      console.log(response)
      setNewGroupName('')
      closeModal()
    } catch (error) {
      console.error('코디북 생성 중 오류 발생:', error)
    }
  }

  const closeModal = () => {
    setCreateModal(false)
  }

  const getFavGrp = (group: Coordibook) => {
    const [favorite, setFavorite] = useState([])

    useEffect(() => {
      async function fetchGroupById(id: number) {
        try {
          const res = await favApi.getFavoritesByGroup(id)
          const data = await res.json()
          setFavorite(data)
        } catch (err) {
          console.error('코디북 상세 데이터 가져오던 중 오류', err)
        }
      }

      fetchGroupById(group.favoriteGroupId)
    }, [group.favoriteGroupId])

    return (
      <div key={group.favoriteGroupId} className="aspect-square">
        <Card
          className="flex items-center h-full overflow-hidden"
          onClick={() => goToCoordiBook(group.favoriteGroupId, group.name)}
        >
          <CardContent
            className={`object-cover p-0 flex flex-wrap ${
              mockFavoriteDetails.length >= 4 ? 'w-full h-full' : ''
            }`}
          >
            {mockFavoriteDetails.slice(0, 4).map((fav) => (
              <div
                key={fav.favoriteId}
                className={`${
                  mockFavoriteDetails.length >= 4
                    ? 'w-1/2 h-1/2 overflow-hidden'
                    : 'h-full w-full'
                }`}
              >
                <img
                  src={fav.coordinate.imageFile.filePath}
                  alt={fav.coordinate.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
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
          className="h-full bg-secondary flex items-center justify-center"
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
        <Modal title="코디북 이름" onClose={closeModal}>
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
