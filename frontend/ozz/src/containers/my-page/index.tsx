'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Modal from '@/components/Modal'

const MyPageIndex = () => {
  const user = {
    nickname: 'ozz',
    email: '123123@ozz.com',
    profile_file_id: null,
  }
  const router = useRouter()
  const [modal, setModal] = useState(false)

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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-full w-16 h-16"
          >
            <path
              d="M10 9C11.6569 9 13 7.65685 13 6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6C7 7.65685 8.34315 9 10 9Z"
              className="fill-gray-300"
            />
            <path
              d="M3 18C3 14.134 6.13401 11 10 11C13.866 11 17 14.134 17 18H3Z"
              className="fill-gray-300"
            />
          </svg>
        )}
        <div className="ml-4 flex-1">
          <div className="bg-secondary text-primary-400 font-bold text-xl inline-block">
            {user.nickname}
          </div>
          <span className="font-bold text-xl">님</span>
          <div className="text-secondary text-sm">{user.email}</div>
        </div>
        <svg
          onClick={goEdit}
          width="30"
          height="30"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-[#CCCED0] ml-4 cursor-pointer"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
          />
        </svg>
      </div>
      <div className="flex mt-4 mb-6 border border-primary-400 w-full max-w-96 rounded-lg h-24 font-medium text-sm">
        <button
          onClick={goCoordiShot}
          className="flex-1 py-2 flex flex-col items-center justify-center h-24 "
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 3C2.89543 3 2 3.89543 2 5V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V5C18 3.89543 17.1046 3 16 3H4ZM16 15H4L8 7L11 13L13 9L16 15Z"
              className="fill-primary-400"
            />
          </svg>
          코디샷
        </button>
        <span className="w-px bg-primary-400 my-8"></span>
        <button className="flex-1 py-2 flex flex-col items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-2"
          >
            <path
              d="M10 2C6.68632 2 4.00003 4.68629 4.00003 8V11.5858L3.29292 12.2929C3.00692 12.5789 2.92137 13.009 3.07615 13.3827C3.23093 13.7564 3.59557 14 4.00003 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0787 13.009 16.9931 12.5789 16.7071 12.2929L16 11.5858V8C16 4.68629 13.3137 2 10 2Z"
              className="fill-primary-400"
            />
            <path
              d="M10 18C8.34315 18 7 16.6569 7 15H13C13 16.6569 11.6569 18 10 18Z"
              className="fill-primary-400"
            />
          </svg>
          알림
        </button>
        <span className="w-px bg-primary-400 my-8"></span>
        <button
          onClick={goSetting}
          className="flex-1 py-2 flex flex-col items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-2"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
              className="fill-primary-400"
            />
          </svg>
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
