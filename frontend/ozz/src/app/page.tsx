import Header from '@/components/Header'
import HeroSection from '@/containers/main-page/HeroSection'
import Preview from '@/containers/main-page/Preview'

export default function Home() {
  const items = [
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
  ] // 임시 데이터

  return (
    <>
      <Header title="OZZ" />
      <HeroSection />
      <Preview title="옷장" items={items} />
      <Preview title="코디북" items={items} />
    </>
  )
}
