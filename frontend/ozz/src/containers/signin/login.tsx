'use client'
import { useEffect } from 'react'

const SignIn = () => {
  useEffect(() => {
    // 네이버 로그인 SDK 추가
    const naverScript = document.createElement('script')
    naverScript.src =
      'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js'
    naverScript.async = true
    naverScript.onload = () => {
      const { naver } = window as any
      const naverLogin = new naver.LoginWithNaverId({
        clientId: 'YOUR_NAVER_CLIENT_ID',
        callbackUrl: 'YOUR_NAVER_CALLBACK_URL',
        isPopup: false,
      })
      naverLogin.init()
    }
    document.head.appendChild(naverScript)

    // 카카오 로그인 SDK 추가
    const kakaoScript = document.createElement('script')
    kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.js'
    kakaoScript.async = true
    kakaoScript.onload = () => {
      const { Kakao } = window as any
      if (Kakao) {
        Kakao.init('YOUR_KAKAO_CLIENT_ID')
      }
    }
    document.head.appendChild(kakaoScript)
  }, [])

  const handleKakaoLogin = () => {
    const { Kakao } = window as any
    if (Kakao) {
      Kakao.Auth.login({
        success: (authObj: any) => {
          console.log(authObj)
        },
        fail: (err: any) => {
          console.error(err)
        },
      })
    }
  }

  return (
    <div className="flex font-bold flex-col items-center justify-center w-full h-screen max-w-xs mx-auto">
      <img src="images/logo_3e3e3e.png" alt="OZZ LOGO" className="mb-8 w-40" />
      <h2 className="text-xl w-full text-left my-10">간편 로그인</h2>
      <div className="flex flex-col items-center space-y-2 w-full">
        <div
          onClick={handleKakaoLogin}
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
