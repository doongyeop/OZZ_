'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Modal from '@/components/Modal'
import { Api as UserAPi } from '@/types/user/Api'
import { FaUser } from 'react-icons/fa6'
import { HiPhotograph } from 'react-icons/hi'
import { HiBell } from 'react-icons/hi'
import { IoIosSettings } from 'react-icons/io'
import { FaChevronRight } from 'react-icons/fa'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNCIsImlhdCI6MTcyMzA5NTU5NCwiZXhwIjoxNzIzMTU1NTk0fQ.gPXyouBMWSdHP5pYFKReF2ebLYOXRaZUDhr-gZjhkaU'

// const api = new UserAPi({
//   securityWorker: async () =>
// })

const MyPageIndex = () => {
  const router = useRouter()
  const [modal, setModal] = useState(false)

  const user = {
    nickname: 'ozz',
    email: '123123@ozz.com',
    profile_file_id: null,
  }

  const goEdit = () => {
    router.push('/mypage/edit')
  }
  const goSetting = () => {
    router.push('/mypage/settings')
  }

  const goCoordiShot = () => {
    router.push('/coordishot')
  }

  const logOut = async () => {
    console.log('로그아웃 완료')
    setModal(false)
  }

  const profileSrc = user.profile_file_id ? user.profile_file_id : null

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <div className="flex items-center p-6 rounded-lg w-full max-w-sm">
        {profileSrc ? (
          <img
            src={profileSrc}
            alt="프로필 사진"
            className="rounded-full w-16 h-16"
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
          onClick={goCoordiShot}
          className="flex-1 py-2 flex flex-col items-center justify-center h-24 "
        >
          <HiPhotograph className="fill-primary-400 w-5 h-5" />
          코디샷
        </button>
        <span className="w-px bg-primary-400 my-8"></span>
        <button className="flex-1 py-2 flex flex-col items-center justify-center">
          <HiBell className="w-5 h-5 fill-primary-400" />
          알림
        </button>
        <span className="w-px bg-primary-400 my-8"></span>
        <button
          onClick={goSetting}
          className="flex-1 py-2 flex flex-col items-center justify-center"
        >
          <IoIosSettings className="fill-primary-400 w-5 h-5" />
          설정
        </button>
      </div>
      <div className="flex flex-col mt-4 space-y-2 w-full max-w-sm text-sm font-medium">
        <h3 className="font-bold text-base py-2">더보기</h3>
        <button className="py-2 text-left">서비스 소개</button>
        <button className="py-2 text-left">약관 및 정책</button>
        <button className="py-2 text-left">오픈소스 라이브러리</button>
        <button className="py-2 text-left" onClick={() => setModal(true)}>
          로그아웃
        </button>
        {modal && (
          <Modal onClose={() => setModal(false)}>
            <p className="font-bold text-base text-center text-primary-400">
              로그아웃 하시겠습니까?
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setModal(false)}
                className="font-bold mr-4 p-1 w-14 border border-primary-400 rounded-full text-xs text-primary-400 hover:bg-primary-400 hover:text-secondary"
              >
                아니오
              </button>
              <button
                onClick={logOut}
                className="font-bold w-14 p-1 border border-primary-400 rounded-full text-xs text-primary-400 hover:bg-primary-400 hover:text-secondary"
              >
                예
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

export default MyPageIndex
