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
        Kakao.Auth.createLoginButton({
          container: '#kakao-login-btn',
          success: (authObj: any) => {
            console.log(authObj)
          },
          fail: (err: any) => {
            console.error(err)
          },
        })
      }
    }
    document.head.appendChild(kakaoScript)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <img
        src="images/logo_filled_green.png"
        alt="OZZ LOGO"
        className="mb-8 w-40"
      />
      <h2 className="text-xl font-bold w-full max-w-xs text-center mt-4 mb-4">
        간편 로그인
      </h2>
      <div className="flex flex-col items-center space-y-4">
        <div
          id="kakao-login-btn"
          className="w-full max-w-xs h-12 flex items-center justify-center"
        ></div>
        <div
          id="naverIdLogin"
          className="w-full max-w-xs h-12 flex items-center bg-[#03C75A] rounded-md"
        >
          <img
            src="images/btnG_아이콘사각.png"
            alt="네이버 로그인"
            className="h-full object-contain"
          />
          <span className="flex-grow text-center text-gray-light">
            네이버 로그인
          </span>
        </div>
      </div>
    </div>
  )
}

export default SignIn
