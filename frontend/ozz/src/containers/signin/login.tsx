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
        clientId: 'clientid',
        callbackUrl: 'http://localhost:8080/login/oauth2/code/naver',
        isPopup: true,
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
        Kakao.init('0048b2b5a157b80b68810cb76cae6971')
      }
    }
    document.head.appendChild(kakaoScript)
  }, [])

  const handleKakaoLogin = () => {
    const { Kakao } = window as any
    if (Kakao) {
      Kakao.Auth.login({
        success: (authObj: any) => {
          fetch('http://i11a804.p.ssafy.io:8080/login/oauth2/code/kakao', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authObj.access_token}`,
            },
            body: JSON.stringify({ token: authObj.access_token }),
          }).then((response) => response.json())
          // .then((data) => {
          //   if (data.isNewUser) {
          //     window.location.href = '/login/signup'
          //   } else {
          //     // 로그인 성공 후 처리
          //     console.log('로그인 성공:', data)
          //   }
          // })
          // .catch((error) => {
          //   console.error('로그인 실패:', error)
          // })
        },
        fail: (err: any) => {
          console.error('카카오 로그인 실패:', err)
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
