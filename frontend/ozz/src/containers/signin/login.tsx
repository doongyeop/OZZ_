'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const SignIn = () => {
  const router = useRouter()

  const onKaKaoLogin = () => {
    window.location.href =
      'http://i11a804.p.ssafy.io:8080/oauth2/authorization/kakao'
  }

  const onNaverLogin = () => {
    window.location.href =
      'http://i11a804.p.ssafy.io:8080/oauth2/authorization/naver'
  }

  return (
    <div className="flex font-bold flex-col items-center justify-center w-full h-screen max-w-xs mx-auto">
      <img src="images/logo_3e3e3e.png" alt="OZZ LOGO" className="mb-8 w-40" />
      <h2 className="text-xl w-full text-left my-10">간편 로그인</h2>
      <div className="flex flex-col items-center space-y-2 w-full">
        <div
          onClick={onKaKaoLogin}
          className="w-full h-10 flex items-center bg-[#FEE500] mx-3 rounded-md"
        >
          <img
            src="images/kakao_logo.png"
            alt="카카오 로그인"
            className="h-full object-contain"
          />
          <span className="flex-grow text-center text-black">
            카카오 로그인
          </span>
        </div>
        <div
          onClick={onNaverLogin}
          id="naverIdLogin"
          className="w-full h-10 flex items-center bg-[#03C75A] mx-3 rounded-md"
        >
          <img
            src="images/btnG_아이콘사각.png"
            alt="네이버 로그인"
            className="h-full object-contain"
          />
          <span className="flex-grow text-center text-white">
            네이버 로그인
          </span>
        </div>
      </div>
    </div>
  )
}

export default SignIn
