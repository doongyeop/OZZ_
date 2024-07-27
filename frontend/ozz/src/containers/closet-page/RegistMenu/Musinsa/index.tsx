'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios from 'axios'

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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(JSON.stringify(data))
    try {
      const response = await axios.get('/api/musinsa-login')
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching order lists:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-3">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
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

export default function MusinsaContainer() {
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
