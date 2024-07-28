import Header from '@/components/Header'
import SearchArea from '@/containers/closet-page/SearchArea'
import ClosetPageContainer from '@/containers/closet-page'

export default function Closet() {
  return (
    <>
      <Header title="나의 옷짱" />
      <SearchArea />
      <ClosetPageContainer />
    </>
  )
}
