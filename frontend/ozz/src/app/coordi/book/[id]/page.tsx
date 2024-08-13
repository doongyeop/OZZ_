'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLongPress } from 'use-long-press'
import Image from 'next/image'
import Link from 'next/link'
import HeaderWithBackward from '@/components/HeaderWithBackward'
import TagButton from '@/components/Button/TagButton'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover'
import { FaBars } from 'react-icons/fa'
import { IoIosArrowDown } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import { mockFavoriteDetails } from '@/types/coordibook'
import { styleMap, styleInvMap, Style } from '@/types/clothing'

interface CoordiBookDetailPageProps {
  params: { id: number }
}

export default function CoordiBookDetailPage({
  params,
}: CoordiBookDetailPageProps) {
  const searchParams = useSearchParams()
  const name = searchParams.get('name') || '코디북 이름'

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

  const [selectedTags, setSelectedTags] = useState<string[]>(['전체'])

  const handleTagClick = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag],
    )
  }

  const filteredItems = selectedTags.includes('전체')
    ? mockFavoriteDetails
    : mockFavoriteDetails.filter((item) =>
        item.coordinate.styleList.some((style: Style) =>
          selectedTags.some(
            (tag) => styleInvMap[style] === tag || style === styleMap[tag],
          ),
        ),
      )

  return (
    <div>
      <HeaderWithBackward title="코디북" />
      <div className="m-4">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">{name}</h1>
          <div className="flex justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex gap-1 items-center bg-gray-light hover:bg-gray-medium border border-gray-dark rounded-lg px-3"
                >
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
        </div>
        <div className="my-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <TagButton key={tag} isSelected onClick={() => handleTagClick(tag)}>
              #{tag}
            </TagButton>
          ))}
        </div>
        <div>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {filteredItems.map((item, index) => (
                <Link
                  key={item.favoriteId}
                  href={`/coordi/detail/${item.coordinate.coordinateId}`}
                >
                  <Image
                    src={item.coordinate.imageFile.filePath}
                    alt={`item ${index + 1}`}
                    width={0}
                    height={0}
                    sizes="100%"
                    className="w-full h-auto"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center">
              <RxCross2 size="90" className="text-gray-dark" />
              <div className="text-center font-semibold">
                <p>스타일이 일치하는 코디가 없어요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
