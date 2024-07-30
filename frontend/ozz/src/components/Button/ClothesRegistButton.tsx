import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

export default function ClothesRegistButton() {
  return (
    <Link
      href="/closet/regist"
      className="fixed bottom-[88px] right-8 bg-secondary text-primary-400 border border-primary-400 rounded-full p-4 shadow-lg flex items-center justify-center"
      style={{ width: '60px', height: '60px' }}
    >
      <FaPlus size={20} />
    </Link>
  )
}
