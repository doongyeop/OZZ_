// src/app/api/authTokens/route.ts
/* eslint-disable import/prefer-default-export */

import { NextRequest, NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  // const cookieStore = cookies()
  // const accessToken = cookieStore.get('access')?.value
  // const refreshToken = cookieStore.get('refresh')?.value
  const cookieHeader = req.headers.get('cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split('; ').reduce(
      (acc, cookie) => {
        const [name, ...value] = cookie.split('=')
        acc[name] = value.join('=')
        return acc
      },
      {} as Record<string, string>,
    )

    // console.log('쿠키에서 읽어온 accessToken:', accessToken)
    // console.log('쿠키에서 읽어온 refreshToken:', refreshToken)

    const accessToken = cookies.access
    const refreshToken = cookies.refresh

    if (accessToken && refreshToken) {
      return NextResponse.json({ accessToken, refreshToken })
    }
    return NextResponse.json({ message: 'Tokens not found' }, { status: 401 })
  }
}
