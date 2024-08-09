'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'

type OrderValue = 'regist' | 'purchase' | 'use'

export default function SearchArea() {
  const [order, setOrder] = useState<OrderValue>('regist')

  return (
    <div className="p-4 flex justify-between bg-white sticky top-20 shadow-sm">
      <form className="ps-4 flex items-center space-x-2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <IoSearch size="20" className="text-secondary" />
          </div>
          <Input
            className="pl-10 border-secondary"
            type="search"
            placeholder="키워드를 입력하세요"
          />
        </div>
      </form>
      <div>
        <Select
          value={order}
          onValueChange={(value: OrderValue) => setOrder(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="등록순" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="regist">등록순</SelectItem>
              <SelectItem value="purchase">구매일자순</SelectItem>
              <SelectItem value="use">인기순</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
