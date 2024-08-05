import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import RegistMenu from '@/containers/closet-page/RegistMenu'

export default function ClothesRegistButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-[88px] right-8 bg-secondary text-primary-400 border border-primary-400 rounded-full p-4 shadow-lg flex items-center justify-center hover:bg-primary-400 focus:bg-primary-400 hover:text-secondary focus:text-secondary"
          style={{ width: '60px', height: '60px' }}
        >
          <FaPlus size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full border-0 shadow-none bg-none">
        <RegistMenu />
      </PopoverContent>
    </Popover>
  )
}
