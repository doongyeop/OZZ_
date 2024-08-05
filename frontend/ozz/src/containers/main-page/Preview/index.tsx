import Link from 'next/link'
import { FaCirclePlus } from 'react-icons/fa6'
import Image from 'next/image'

interface PreviewProps {
  title: '옷장' | '코디북'
  items?: { image: string }[]
}

export default function Preview({ title, items }: PreviewProps) {
  const content = {
    옷장: {
      link: '/closet',
      itemName: '옷',
    },
    코디북: {
      link: '/coordi',
      itemName: '코디',
    },
  }

  return (
    <div>
      <div className="flex items-center justify-between mx-4 my-2">
        <h2 className="text-2xl font-bold">
          <span className="bg-secondary text-primary-400 px-0.5">OZZ</span>
          {` 님의 ${title}`}
        </h2>
        <Link href={content[title].link}>전체보기 &gt;</Link>
      </div>
      {items ? (
        <div className="mx-3 h-32 flex justify-around">
          {items.map((item, index) => (
            <div key={item.image}>
              <Image
                src={item.image}
                alt={`${content[title]}-${index}`}
                width={0}
                height={0}
                sizes="100%"
                className="w-auto h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-3 h-32 bg-primary-50 flex flex-col justify-center items-center">
          <p>{content[title].itemName} 등록하기</p>
          <FaCirclePlus />
        </div>
      )}
    </div>
  )
}
