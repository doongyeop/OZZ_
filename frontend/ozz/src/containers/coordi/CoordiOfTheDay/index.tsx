'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IoIosArrowDown } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import TagButton from '@/components/Button/TagButton'

const styleTags = [
  '전체',
  '스트릿',
  '캐주얼',
  '스포티',
  '포멀',
  '로맨틱',
  '엘레강스',
  '매니시',
  '모던',
  '내추럴',
  '에스닉',
]

export default function CoordiOfTheDay({
  selectedDate,
  coordinations,
}: {
  selectedDate: string
  coordinations: { id: string; image: string }[]
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>(['전체'])

  const handleTagClick = (tag: string) => {
    if (tag === '전체') {
      setSelectedTags(['전체'])
    } else {
      setSelectedTags((prevTags) =>
        prevTags.includes(tag)
          ? prevTags.length === 1
            ? ['전체']
            : prevTags.filter((t) => t !== tag)
          : [...prevTags.filter((t) => t !== '전체'), tag],
      )
    }
  }

  return (
    <div className="m-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          {selectedDate}{' '}
          <span className="bg-secondary text-primary-400 px-0.5">
            #추천_코디
          </span>
        </h1>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex gap-1 items-center bg-gray-light hover:bg-gray-medium border border-gray-dark rounded-lg px-3">
              스타일 태그
              <IoIosArrowDown />
            </button>
          </PopoverTrigger>
          <PopoverContent className="me-4 bg-gray-light">
            <div className="flex flex-wrap gap-2">
              {styleTags.map((tag) => (
                <TagButton
                  key={tag}
                  isSelected={selectedTags.includes(tag)}
                  onClick={() => handleTagClick(tag)}
                >
                  #{tag}
                </TagButton>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <div className="my-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <TagButton
              key={tag}
              isSelected={true}
              onClick={() => handleTagClick(tag)}
            >
              #{tag}
            </TagButton>
          ))}
        </div>
      </div>
      {coordinations.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {coordinations.map((coordination, index) => (
            <Link href={`/coordi/${coordination.id}`}>
              <img
                key={index}
                src={coordination.image}
                alt={`Coordination ${index + 1}`}
                className="w-full h-auto"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center">
          <RxCross2 size="90" className="text-gray-dark" />
          <div className="text-center font-semibold">
            <p>AI 코디 추천을 위해서는</p>
            <p>옷장에 더 많은 옷이 필요해요 ㅜ.ㅜ</p>
          </div>
          <Link
            href="/closet"
            className="bg-secondary text-primary-400 rounded-full font-bold mt-8 px-10 py-2"
          >
            내 옷장 바로가기
          </Link>
        </div>
      )}
    </div>
  )
}
