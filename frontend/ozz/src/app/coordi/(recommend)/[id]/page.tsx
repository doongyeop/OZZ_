import OutlineButton from '@/components/Button/OutlineButton'
import TagButton from '@/components/Button/TagButton'
import HeaderWithBackward from '@/components/HeaderWithBackward'
import Link from 'next/link'
import { MdOutlineShare } from 'react-icons/md'
import { RiDownloadLine } from 'react-icons/ri'

export default function CoordiDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const coordination = {
    id: '0',
    image:
      'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
    styles: ['스트릿', '캐주얼'],
    items: [
      {
        id: 0,
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/36996/detail_36996_66a197b67daad_500.jpg?w=1000',
      },
      {
        id: 1,
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/36971/detail_36971_66a19761aa51f_500.jpg?w=1000',
      },
      {
        id: 2,
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/37027/detail_37027_66a2ee8fb080e_500.jpg?w=1000',
      },
      {
        id: 3,
        image:
          'https://image.msscdn.net/thumbnails/images/codimap/detail/37026/detail_37026_66a2ee8c7c5fa_500.jpg?w=1000',
      },
    ],
  }

  return (
    <>
      <HeaderWithBackward />
      <img src={coordination.image} alt={coordination.id} />
      <div className="m-4">
        <h1 className="text-xl font-semibold">추천 코디 #{coordination.id}</h1>
        <div className="my-4 flex gap-4">
          <OutlineButton>
            <RiDownloadLine className="text-primary-400" />
            <span className="ms-2 text-sm">내 코디에 저장하기</span>
          </OutlineButton>
          <OutlineButton>
            <MdOutlineShare className="text-primary-400" />
            <span className="ms-2 text-sm">커뮤니티에 공유하기</span>
          </OutlineButton>
        </div>
        <div className="my-10">
          <h4 className="font-semibold">스타일 태그</h4>
          <div className="my-2 flex flex-wrap gap-2">
            {coordination.styles.map((style) => (
              <TagButton key={style} isSelected={true}>
                # {style}
              </TagButton>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">코디에 사용된 아이템</h4>
          <div className="h-32 flex gap-4 my-2">
            {coordination.items.map((item, index) => (
              <Link href={`/closet/modify/${item.id}`} key={item.id}>
                <img
                  src={item.image}
                  alt={`Item-${index}`}
                  className="h-full object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
