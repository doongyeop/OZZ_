'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loading from '@/app/closet/loading'

const FormSchema = z.object({
  userId: z.string().min(1, { message: '아이디를 입력해 주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해 주세요.' }),
})

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false) // 로딩 상태 추가

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true) // 요청 시작 시 로딩 상태를 true로 설정
    try {
      const response = await fetch('/api/musinsa-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.error) {
        alert(result.error)
        setIsLoading(false) // 에러 발생 시 로딩 상태를 false로 설정
      } else {
        router.push('/closet')
      }
    } catch (error) {
      alert('아이디 또는 비밀번호를 확인하세요.')
      setIsLoading(false) // 에러 발생 시 로딩 상태를 false로 설정
    }
  }

  if (isLoading) {
    return <Loading /> // 로딩 중일 때 로딩 컴포넌트를 표시
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-3">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Input placeholder="아이디" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="비밀번호" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          className="bg-black text-white rounded-sm py-2 w-full"
        >
          로그인
        </button>
      </form>
    </Form>
  )
}

export default function MusinsaLogin() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="my-1 w-full h-10 bg-black text-white px-6 py-2 flex items-center justify-center">
        <img
          src="/images/malls/logo_musinsa.png"
          alt="MUSINSA"
          className="h-3 pe-0.5"
        />
        에서 옷 가져오기
      </div>
      <h1 className="text-lg my-3">로그인</h1>
      <InputForm />
    </div>
  )
}
