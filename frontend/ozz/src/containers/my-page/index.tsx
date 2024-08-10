'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Modal from '@/components/Modal'
import { Api as UserApi } from '@/types/user/Api'
import { Api as FileApi } from '@/types/file/Api'
import { Api as AuthApi } from '@/types/auth/Api'
import { FaUser } from 'react-icons/fa6'
import { HiPhotograph, HiBell } from 'react-icons/hi'
import { IoIosSettings } from 'react-icons/io'
import { FaChevronRight } from 'react-icons/fa'
import LoadingPage from '@/components/Loading/loading'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNCIsImlhdCI6MTcyMzI2MzI3NCwiZXhwIjoxNzIzMzIzMjc0fQ.akVzmZwAMkVm3Jh5Ed50b19bHASywIVodLoPP2wHJRQ'

const userApi = new UserApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

const fileApi = new FileApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

const authApi = new AuthApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

export default function MyPageIndex() {
  const router = useRouter()
  const [modal, setModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profileSrc, setProfileSrc] = useState('')
  const [profilePic, setProfilePic] = useState()
  const setCookie = (name: string, value: any, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
  }
  const [loading, setLoading] = useState(true)

  const deleteAllCookies = () => {
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
    })
  }

  const getProfilePic = async (picId: number) => {
    try {
      const response = await fileApi.getFile(picId)
      const data = await response.json()
      setProfilePic(data)
      const picRes = await fileApi.downloadFile(data.filePath)
      const blob = await picRes.blob()
      const urlStr = URL.createObjectURL(blob)
      setProfileSrc(urlStr)
    } catch (error) {
      console.log(error)
    }
  }

  const getUser = async () => {
    setLoading(true) // 데이터를 가져오기 전에 로딩 상태로 설정
    try {
      const response = await userApi.getUserInfo()
      const userData = await response.json()
      if (userData) {
        setUser(userData)
        setCookie('userInfo', JSON.stringify(userData), 1)
        if (userData.profileFileId) {
          await getProfilePic(userData.profileFileId)
        }
      } else {
        setLoading(true) // userData가 없을 경우 로딩 상태로 유지
      }
    } catch (error) {
      console.error('유저 정보를 가져오는 중 오류 발생:', error)
    } finally {
      setLoading(false) // 데이터 처리 후 로딩 상태 해제
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const goEdit = () => {
    router.push('/mypage/edit')
  }
  const goSetting = () => {
    router.push('/mypage/settings')
  }

  const goCoordiShot = () => {
    router.push('/coordishot')
  }

  const logOut = async (userId: number) => {
    try {
      console.log('userId로 전달되고 있는 건요:', userId)
      const response = await authApi.deleteRefreshTokenOfUser(userId)
      console.log(response)
      deleteAllCookies()
      router.push('/login')
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
    }
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      {loading ? (
        <LoadingPage
          messages={['유저 정보를', '로딩 중입니다']}
          footerMessage={'조금만 기다려주세요'}
        />
      ) : (
        <div>
          <div className="flex items-center p-6 rounded-lg w-full max-w-sm">
            {profileSrc ? (
              <Image
                src={profileSrc}
                alt="프로필 사진"
                className="rounded-full w-16 h-16"
                width={64} // w-16에 해당하는 픽셀 값
                height={64} // h-16에 해당하는 픽셀 값
                priority // 페이지 로딩 시 우선적으로 로드할 경우
              />
            ) : (
              <FaUser className="fill-gray-300 w-16 h-16 rounded-full" />
            )}
            <div className="ml-4 flex-1">
              <div className="bg-secondary text-primary-400 font-bold text-xl inline-block">
                {user.nickname}
              </div>
              <span className="font-bold text-xl">님</span>
              <div className="text-secondary text-sm">{user.email}</div>
            </div>
            <FaChevronRight onClick={goEdit} className="w-7 fill-[#CCCED0]" />
          </div>
          <div className="flex mt-4 mb-6 border border-primary-400 w-full max-w-96 rounded-lg h-24 font-medium text-sm">
            <button
              type="button"
              onClick={goCoordiShot}
              className="flex-1 py-2 flex flex-col items-center justify-center h-24 "
            >
              <HiPhotograph className="fill-primary-400 w-5 h-5" />
              코디샷
            </button>
            <span className="w-px bg-primary-400 my-8" />
            <button
              type="button"
              className="flex-1 py-2 flex flex-col items-center justify-center"
            >
              <HiBell className="fill-primary-400 w-5 h-5" />
              알림
            </button>
            <span className="w-px bg-primary-400 my-8" />
            <button
              type="button"
              onClick={goSetting}
              className="flex-1 py-2 flex flex-col items-center justify-center"
            >
              <IoIosSettings className="fill-primary-400 w-5 h-5" />
              설정
            </button>
          </div>
          <div className="flex flex-col mt-4 space-y-2 w-full max-w-sm text-sm font-medium">
            <h3 className="font-bold text-base py-2">더보기</h3>
            <button type="button" className="py-2 text-left">
              서비스 소개
            </button>
            <button type="button" className="py-2 text-left">
              약관 및 정책
            </button>
            <button type="button" className="py-2 text-left">
              오픈소스 라이브러리
            </button>
            <button
              type="button"
              className="py-2 text-left"
              onClick={() => setModal(true)}
            >
              로그아웃
            </button>
            {modal && (
              <Modal onClose={() => setModal(false)}>
                <p className="font-bold text-base text-center text-primary-400">
                  로그아웃 하시겠습니까?
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="font-bold mr-4 p-1 w-14 border border-primary-400 rounded-full text-xs text-primary-400 hover:bg-primary-400 hover:text-secondary"
                  >
                    아니오
                  </button>
                  <button
                    type="button"
                    onClick={() => logOut(user.id)}
                    className="font-bold w-14 p-1 border border-primary-400 rounded-full text-xs text-primary-400 hover:bg-primary-400 hover:text-secondary"
                  >
                    예
                  </button>
                </div>
              </Modal>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
