import Header from '@/components/Header'
import Link from 'next/link'
import HotCoordinations from '@/containers/community/HotCoordinations'

export default function Community() {
  return (
    <>
      <Header title="커뮤니티" />
      <div>
        <div className="m-4 mb-2 flex justify-end">
          <Link href="/community/all">전체보기 &gt;</Link>
        </div>
        <HotCoordinations />
      </div>
    </>
  )
}
