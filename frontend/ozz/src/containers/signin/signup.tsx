'use client'
import { useRouter } from 'next/navigation'
import { DatePicker } from '@/components/Datepicker'

const SignUp = () => {
  const router = useRouter()

  const handlePrevious = () => {
    router.push('/login')
  }

  const handleNext = () => {
    router.push('/login/signup/success')
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
                className="focus:outline-none border border-primary-400 rounded-full p-1 px-2 h-10 flex-grow"
              />
              <button className="bg-primary-400 rounded-full font-bold text-sm h-10 w-24 leading-none">
                중복 확인
              </button>
            </div>
            <span className="text-xs">사용할 수 없는 닉네임입니다</span>
          </div>
          <div className="mt-5 mb-10 mx-auto w-[360px]">
            <div className="font-bold my-4">생년월일</div>
            <DatePicker
              defaultValue={'2000-10-20'}
              buttonClassName={'w-[360px]'}
            />
          </div>
          <div className="flex justify-center space-x-3 w-full mt-5">
            <button
              onClick={handlePrevious}
              className="flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current text-[#8E98A8] hover:text-secondary"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L9.29289 10.7071C8.90237 10.3166 8.90237 9.68342 9.29289 9.29289L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L11.4142 10L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071ZM9.70711 15.7071C9.31658 16.0976 8.68342 16.0976 8.29289 15.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289L8.29289 4.29289C8.68342 3.90237 9.31658 3.90237 9.70711 4.29289C10.0976 4.68342 10.0976 5.31658 9.70711 5.70711L5.41421 10L9.70711 14.2929C10.0976 14.6834 10.0976 15.3166 9.70711 15.7071Z"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-current text-[#8E98A8] hover:text-secondary"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.2929 15.7071C9.90237 15.3166 9.90237 14.6834 10.2929 14.2929L14.5858 10L10.2929 5.70711C9.90237 5.31658 9.90237 4.68342 10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289L16.7071 9.29289C17.0976 9.68342 17.0976 10.3166 16.7071 10.7071L11.7071 15.7071C11.3166 16.0976 10.6834 16.0976 10.2929 15.7071Z"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L8.58579 10L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L10.7071 9.29289C11.0976 9.68342 11.0976 10.3166 10.7071 10.7071L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
