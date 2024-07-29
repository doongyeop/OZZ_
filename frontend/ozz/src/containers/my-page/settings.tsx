'use client'
import React, { useState } from 'react'

const Switcher = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <div className="flex items-center">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div
          className={`block h-6 w-11 rounded-full transition ${isChecked ? 'bg-secondary' : 'bg-gray-300'}`}
        ></div>
        <div
          className={`dot absolute left-0.5 top-0.5 h-5 w-5 rounded-full transition ${isChecked ? 'translate-x-full bg-primary-400' : 'bg-white'}`}
        ></div>
      </label>
    </div>
  )
}

const Settings = () => {
  return (
    <div className="text-sm w-full h-full w-full max-w-sm flex flex-col justify-center">
      <div className="m-9 w-full">
        <h2 className="text-base font-bold">알림</h2>
        <div className="mt-2 flex justify-between">
          <span>코디샷 좋아요 푸시 알림</span>
          <Switcher />
        </div>
      </div>
      <div className="flex flex-col m-9 w-full max-w-sm">
        <h2 className="text-base font-bold">간편로그인</h2>
        <div className="mt-2 flex w-full justify-between">
          <span>카카오 로그인 연동</span>
          <Switcher />
        </div>
        <div className="mt-2 flex justify-between">
          <span>네이버 로그인 연동</span>
          <Switcher />
        </div>
      </div>
    </div>
  )
}

export default Settings
