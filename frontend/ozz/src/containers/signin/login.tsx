'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import Image from 'next/image'
import { login } from '@/services/authApi'

function SignIn() {
  const onKaKaoLogin = () => login('kakao')
  const onNaverLogin = () => login('naver')

  return (
    <div className="flex font-bold flex-col items-center justify-center w-full h-screen max-w-xs mx-auto">
      <img src="images/logo_3e3e3e.png" alt="OZZ LOGO" className="mb-8 w-40" />
      <h2 className="text-xl w-full text-left my-10">간편 로그인</h2>
      <div className="flex flex-col items-center space-y-2 w-full">
        <button
          type="button"
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
        </button>
        <button
          type="button"
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
        </button>
      </div>
    </div>
  )
}

export default SignIn
