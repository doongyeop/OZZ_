// src/app/api/authTokens/route.ts
/* eslint-disable import/prefer-default-export */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('access')?.value
  const refreshToken = cookieStore.get('refresh')?.value
  console.log('토큰', accessToken, refreshToken)

  if (accessToken && refreshToken) {
    return NextResponse.json({ accessToken, refreshToken })
  }
  return NextResponse.json({ message: 'Tokens not found' }, { status: 401 })
}
