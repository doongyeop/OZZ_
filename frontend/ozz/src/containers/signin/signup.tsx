'use client'
import { useRouter } from 'next/navigation'
import { DatePicker } from '@/components/Datepicker'
import { Api as UserApi } from '@/types/user/Api'
import { useState, useEffect } from 'react'
import { FiChevronsRight, FiChevronsLeft } from 'react-icons/fi'

const token =
  'eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsImlkIjoiNCIsImlhdCI6MTcyMzA3NTUyNSwiZXhwIjoxNzIzMTM1NTI1fQ.wBaVemoWwM3ksUxjA_5sMSU5VK1s9ANWEF8Zjz9M5fs'

const api = new UserApi({
  securityWorker: async () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
})

const SignUp = () => {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [responseText, setResponseText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [birthday, setBirthday] = useState<Date | null>(null)

  const getBirthday = async () => {
    try {
      const res = await api.getUserInfo()
      const userData = await res.json()
      const bday = new Date(userData.birth)
      setBirthday(bday)
    } catch (error) {
      console.error('생년월일 정보를 가져오는 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    getBirthday()
  }, [])

  const confirmSignUp = () => {
    if (responseText) {
      try {
        const userData = {
          nickname,
          birthday,
        }
        // const userConfirm = await api.updateUser() {

        // }
        console.log('회원가입 제대로')
      } catch (error) {
        console.log('회원가입 중 오류 발생: ' + error)
      }
    } else {
      return
    }
  }

  const handlePrevious = () => {
    router.back()
  }

  const handleNext = () => {
    confirmSignUp()
    router.push('/login/signup/success')
  }

  async function checkNicknameDuplication(nickname: string) {
    if (nickname.length > 15) {
      setErrorText('닉네임은 15자 이내여야 합니다')
      setResponseText('')
      return
    }
    if (nickname.includes(' ')) {
      setResponseText('')
      setErrorText('공백은 사용 불가능합니다')
      return
    }

    try {
      const response = await api.checkNickname({ nickname })
      setResponseText(await response.text())
      setErrorText('')
      setNickname(nickname)
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
            {birthday && (
              <DatePicker
                defaultValue={birthday}
                buttonClassName={'w-[360px]'}
              />
            )}
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
