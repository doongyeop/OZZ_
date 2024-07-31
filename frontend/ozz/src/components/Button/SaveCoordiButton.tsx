import { Button } from '../ui/button'
import { HiDownload } from 'react-icons/hi'

export default function SaveCoordiButton() {
  return (
    <Button variant={'line'} className="w-48 h-9 p-4">
      {' '}
      <HiDownload className="text-primary-400 mr-2" /> 내 코디에 저장하기{' '}
    </Button>
  )
}
