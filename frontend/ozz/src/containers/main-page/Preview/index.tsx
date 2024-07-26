import Link from 'next/link'
import { FaCirclePlus } from 'react-icons/fa6'

interface PreviewProps {
  title: '옷장' | '코디북'
  items?: Object[]
}

export default function Preview({ title }: PreviewProps) {
  const content = {
    옷장: {
      link: '/closet',
      itemName: '옷',
      items: [
        {
          image:
            'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
        },
        {
          image:
            'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
        },
        {
          image:
            'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
        },
        {
          image:
            'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
        },
      ], // 임시 데이터
    },
    코디북: {
      link: '/coordi',
      itemName: '코디',
      items: [
        {
          image:
            'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
        },
        {
          image:
            'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
        },
        {
          image:
            'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
        },
        {
          image:
            'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
        },
      ], // 임시 데이터
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
      {content[title].items ? (
        <div className="mx-3 h-32 flex justify-around">
          {content[title].items.map((item, index) => (
            <div key={index}>
              <img
                src={item.image}
                alt={`${content[title]}-${index}`}
                className="h-full object-cover"
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
