// src/app/api/authTokens/route.ts
/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  console.log('authTokens GET 시작')
  const cookieStore = cookies()
  const accessToken = cookieStore.get('access')?.value
  const refreshToken = cookieStore.get('refresh')?.value
  // const cookieHeader = req.headers.get('cookie')
  // console.log('cookieHeader? ', cookieHeader)
  // if (cookieHeader) {
  //   const cookies = cookieHeader.split('; ').reduce(
  //     (acc, cookie) => {
  //       const [name, ...value] = cookie.split('=')
  //       acc[name] = value.join('=')
  //       return acc
  //     },
  //     {} as Record<string, string>,
  //   )

  //   const accessToken = cookies.access
  //   const refreshToken = cookies.refresh
  // }

  console.log('쿠키에서 읽어온 accessToken:', accessToken)
  console.log('쿠키에서 읽어온 refreshToken:', refreshToken)

  if (accessToken && refreshToken) {
    return NextResponse.json({ accessToken, refreshToken })
  }
  return NextResponse.json({ message: 'Tokens not found' }, { status: 401 })
}
