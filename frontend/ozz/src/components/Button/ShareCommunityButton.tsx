import { Button } from '../ui/button'
import { FaShareAlt } from 'react-icons/fa'

export default function ShareCommunityButton() {
  return (
    <Button variant={'line'} className="w-48 h-9 p-4">
      {' '}
      <FaShareAlt className="text-primary-400 mr-2" /> 커뮤니티에 공유하기{' '}
    </Button>
  )
}
