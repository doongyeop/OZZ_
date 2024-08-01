import Link from 'next/link'
import Image from 'next/image'
import { useSelectedItem } from '@/contexts/SelectedItemContext'

interface ClothesListProps {
  clothingList: any[]
  isSelectable: boolean
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

export default function ClothesList({
  clothingList,
  isSelectable,
}: ClothesListProps) {
  const { selectedItem, setSelectedItem } = useSelectedItem()

  const handleSelectItem = (item: any) => {
    if (selectedItem && selectedItem.clothesId === item.clothesId) {
      setSelectedItem(null)
    } else {
      setSelectedItem(item)
    }
    console.log(selectedItem)
  }

  return (
    <div className="flex flex-col justify-start items-center h-96">
      {clothingList.map((item) =>
        isSelectable ? (
          <div
            key={item.clothesId}
            className={`px-5 w-full hover:bg-primary-100 active:bg-primary-100 cursor-pointer ${
              selectedItem && selectedItem.clothesId === item.clothesId
                ? 'bg-primary-100'
                : ''
            }`}
            onClick={() => handleSelectItem(item)}
          >
            <div className="flex items-center mb-4 mt-4">
              <Image
                src={item.imageFile.filePath}
                alt={item.name}
                width={75}
                height={75}
                className="mr-4"
              />
              <div>
                <div className="text-sm text-gray-500">
                  {formatDate(item.createdDate)}
                </div>
                <div className="text-lg font-semibold">{item.name}</div>
              </div>
            </div>
            <hr />
          </div>
        ) : (
          <Link
            key={item.clothesId}
            href={`/closet/modify/${item.clothesId}`}
            passHref
            className="px-5 w-full hover:bg-primary-100 active:bg-primary-100"
          >
            <div className="flex items-center mb-4 mt-4 cursor-pointer">
              <Image
                src={item.imageFile.filePath}
                alt={item.name}
                width={75}
                height={75}
                className="mr-4"
              />
              <div>
                <div className="text-sm text-gray-500">
                  {formatDate(item.createdDate)}
                </div>
                <div className="text-lg font-semibold">{item.name}</div>
              </div>
            </div>
            <hr />
          </Link>
        ),
      )}
    </div>
  )
}
