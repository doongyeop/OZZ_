'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useState } from 'react'
import { HeaderButton } from '@/components/Button/HeaderButton'
import { FaBars } from 'react-icons/fa'
import TagButton from '@/components/Button/TagButton'
import Image from 'next/image'
import Link from 'next/link'
import CoordiOfTheDay from '@/containers/coordi/CoordiOfTheDay'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover'
import { IoIosArrowDown } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'

interface CoordiBookDetailPageProps {
  params: { id: number }
}

const CoordiBookDetailPage: React.FC<CoordiBookDetailPageProps> = ({
  params,
}) => {
  const { id } = params

  const favorite_group = {
    favorite_group_name: '끝내주는 싸피 출근룩',
    id: `${id}`,
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
    items: [
      {
        id: 0,
        style: ['스트릿', '캐주얼', '스포티'],
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
      },
      {
        id: 1,
        style: ['스트릿', '매니시'],
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
      },
      {
        id: 2,
        style: ['포멀'],
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
      },
      {
        id: 3,
        style: ['캐주얼'],
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
      },
    ],
  }

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

  const toggleSidebar = () => {
    // 사이드바 토글 기능 추가 필요
  }

  const leftButton = <HeaderButton icon={<FaBars />} onClick={toggleSidebar} />

  const filteredItems = selectedTags.includes('전체')
    ? favorite_group.items
    : favorite_group.items.filter((item) =>
        item.style.some((style) => selectedTags.includes(style)),
      )

  return (
    <div>
      <Header title={'코디북'} leftButton={leftButton} />
      <div className="m-4">
        <div className="flex justify-between">
          <h1 className="font-bold text-2xl">
            {favorite_group.favorite_group_name}
          </h1>
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
                <Link key={item.id} href={`/coordi/${item.id}`}>
                  <Image
                    src={item.image}
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

export default CoordiBookDetailPage
