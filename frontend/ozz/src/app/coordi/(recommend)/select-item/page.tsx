import { HeaderButton } from '@/components/Button/HeaderButton'
import Header from '@/components/Header'
import SelectItemContainer from '@/containers/coordi/SelectItem'
import { IoChevronBack } from 'react-icons/io5'

export default function SelectItem() {
  return (
    <>
      <Header
        title="추천 코디"
        leftButton={
          <HeaderButton icon={<IoChevronBack size={28} />} href="/coordi" />
        }
      />
      <SelectItemContainer />
    </>
  )
}
