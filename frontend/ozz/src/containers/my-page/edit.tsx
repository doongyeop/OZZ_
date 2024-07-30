import { DatePicker } from '@/components/Datepicker'
import React from 'react'

export default function ProfileEdit() {
  const user = {
    birth: '1998-12-07',
    nickname: '까미언니',
    email: 'kkamisister1207@gmail.com',
    profile_file_id: 'https://cdn2.thecatapi.com/images/2nk.jpg',
  }

  return (
    <div className="w-full max-w-[360px] mx-auto h-full flex flex-col items-center justify-between">
      <div className="w-full flex flex-col items-center space-y-4">
        {user.profile_file_id ? (
          <img
            src={user.profile_file_id}
            alt="프로필 이미지"
            className="w-[100px] h-[100px] rounded-full"
          />
        ) : (
          <svg
            width="100"
            height="100"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-full w-[100px] h-[100px]"
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
        <button className="w-32 mt-2 px-4 py-2 border border-primary-400 text-xs font-medium rounded h-[30px] flex items-center justify-center">
          프로필 이미지 변경
        </button>
      </div>
      <div className="flex flex-col items-center w-full space-y-4">
        <div className="w-full text-sm font-medium">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="text"
            value={user.email}
            readOnly
            className="mt-1 block w-full px-3 py-2 rounded text-[#CCCED0] focus:outline-none text-xs font-medium bg-gray-light cursor-not-allowed h-[30px]"
          />
        </div>
        <div className="w-full text-sm font-medium">
          <label htmlFor="nickname">닉네임</label>
          <div className="relative text-xs font-medium">
            <input
              id="nickname"
              type="text"
              defaultValue={user.nickname}
              className="px-3 w-full block border border-[#ECECEE] rounded focus:outline-none focus:ring-none h-[30px] hover:border-primary-400"
            />
            <div className="absolute inset-y-0 end-0 flex items-center pr-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                  fill="#CCCED0"
                />
                <path
                  d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                  fill="#CCCED0"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full text-sm font-medium">
          <label htmlFor="birth">생년월일</label>
          <DatePicker
            defaultValue={user.birth}
            buttonClassName="w-[360px] text-xs font-medium border-[#ECECEE] h-[30px] rounded hover:border-primary-400"
          />
        </div>
        <button className="w-full mt-60 border border-[#DB6262] text-[#DB6262] h-[30px] flex items-center justify-center rounded px-2 py-1">
          회원 탈퇴
        </button>
      </div>
    </div>
  )
}
