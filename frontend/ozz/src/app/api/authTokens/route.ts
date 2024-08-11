'use server'

/* eslint-disable import/prefer-default-export */

import { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 쿠키 헤더에서 쿠키를 파싱합니다.
  const cookies = cookie.parse(req.headers.cookie || '')

  // 특정 쿠키를 가져옵니다.
  const accessToken = cookies.access
  const refreshToken = cookies.refresh

  console.log('Access Token:', accessToken)
  console.log('Refresh Token:', refreshToken)

  if (accessToken && refreshToken) {
    return res.status(200).json({ accessToken, refreshToken })
  } else {
    return res.status(404).json({ message: 'Tokens not found' })
  }
}
