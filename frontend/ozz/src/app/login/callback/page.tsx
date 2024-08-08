'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import axios from 'axios'

const Callback = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchUserInfo = async (accessToken: string) => {
      try {
        const response = await axios.get(
          'http://i11a804.p.ssafy.io:8080/api/userinfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        const userData = response.data
        localStorage.setItem('userInfo', JSON.stringify(userData))
        localStorage.setItem('accessToken', accessToken)

        router.push('/login/luckyvicky') // 유저 정보를 가져온 후 리다이렉트할 페이지로 이동
      } catch (error) {
        console.error('유저 정보를 가져오는 중 오류 발생:', error)
      }
    }

    const accessToken = searchParams.get('accessToken')
    if (accessToken) {
      fetchUserInfo(accessToken)
    }
  }, [router, searchParams])

  return <div>회원정보가져오는 중...</div>
}

export default Callback
