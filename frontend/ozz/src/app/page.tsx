import Header from '@/components/Header'
import HeroSection from '@/containers/main-page/HeroSection'
import Preview from '@/containers/main-page/Preview'

export default function Home() {
  return (
    <>
      <Header title="OZZ" />
      <HeroSection />
      <Preview title={'옷장'} />
      <Preview title={'코디북'} />
    </>
  )
}
