'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useRouter } from 'next/navigation'
import DatePicker from '@/components/Datepicker'
import { Api as UserApi } from '@/types/user/Api'
import { useState, useEffect } from 'react'
import { FiChevronsRight, FiChevronsLeft } from 'react-icons/fi'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNCIsImlhdCI6MTcyMzI2MzI3NCwiZXhwIjoxNzIzMzIzMjc0fQ.akVzmZwAMkVm3Jh5Ed50b19bHASywIVodLoPP2wHJRQ'
const api = new UserApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

function SignUp() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [responseText, setResponseText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [birthday, setBirthday] = useState<Date | null>(null)

  const getBirthday = async () => {
    try {
      const res = await api.getUserInfo()
      const userData = await res.json()
      // console.log('userData', userData)
      const bday = new Date(userData.birth)
      setBirthday(bday)
      // console.log('생년월일 정보를 가져왔습니다:', bday)
    } catch (error) {
      // console.error('생년월일 정보를 가져오는 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    getBirthday()
  }, [])

  // const setCookie = (name: string, value: string, days: number) => {
  //   const expires = new Date(Date.now() + days * 864e5).toUTCString()
  //   document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
  // }

  const confirmSignUp = async () => {
    if (responseText) {
      try {
        const userData = {
          nickname,
          birth: birthday?.toISOString() || '', // ISO 형식으로 변환
        }
        const userUpdateResponse = await api.updateUser(userData)
        const data = await userUpdateResponse.json()
        // console.log(data)
        // console.log('회원가입이 성공적으로 완료되었습니다.')
        // setCookie('nickname', userData.nickname, 7)
        return true
      } catch (error) {
        console.log('회원가입 중 오류 발생:', error)
        return false
      }
    } else {
      console.log('응답 텍스트가 없습니다.')
      return false
    }
  }

  const handlePrevious = () => {
    router.back()
  }

  const handleNext = async () => {
    const isSignupSuccess = await confirmSignUp()
    if (isSignupSuccess) {
      router.push('/login/signup/success')
    } else {
      window.alert('닉네임을 설정하세요')
    }
  }

  async function checkNicknameDuplication(nick: string) {
    if (nick.length > 15) {
      setErrorText('닉네임은 15자 이내여야 합니다')
      setResponseText('')
      return
    }
    if (nick.includes(' ')) {
      setResponseText('')
      setErrorText('공백은 사용 불가능합니다')
      return
    }

    try {
      const response = await api.checkNickname({ nickname: nick })
      setResponseText(await response.text())
      setErrorText('')
      setNickname(nick)
    } catch (error) {
      setErrorText('이미 사용 중인 닉네임입니다')
      setResponseText('')
    }
  }

  return (
    <div className="w-[360px] m-4 mx-auto">
      <h1 className="text-2xl mt-4 mb-14 font-extrabold text-center">
        회원가입
      </h1>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 w-[360px] mx-auto">
            <div className="font-bold w-[360px] my-4">닉네임 입력하기</div>
            <div className="flex space-x-2 mb-1 w-full">
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="focus:outline-none border border-primary-400 rounded-full p-1 px-2 h-10 flex-grow"
              />
              <button
                type="button"
                onClick={() => checkNicknameDuplication(nickname)}
                className="bg-primary-400 rounded-full font-bold text-sm h-10 w-24 leading-none"
              >
                중복 확인
              </button>
            </div>
            {errorText && (
              <span className="text-xs text-red-500">{errorText}</span>
            )}
            {responseText && <span className="text-xs">{responseText}</span>}
          </div>
          <div className="mt-5 mb-10 mx-auto w-[360px]">
            <div className="font-bold my-4">생년월일</div>

            <DatePicker
              defaultValue={birthday ? birthday.toISOString() : undefined}
              buttonClassName="w-[360px]"
              onDateChange={(date) => {
                setBirthday(date)
              }}
            />
          </div>
          <div className="flex justify-center space-x-3 w-full mt-5">
            <FiChevronsLeft
              onClick={handlePrevious}
              className="text-[#8E98A8] hover:text-secondary text-2xl"
            />
            <FiChevronsRight
              onClick={handleNext}
              className="text-[#8E98A8] hover:text-secondary text-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
