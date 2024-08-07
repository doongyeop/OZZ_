import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FaBookmark, FaHeart, FaRegHeart } from 'react-icons/fa6'

import { CoordishotDetail } from '@/types/coordishot'
import ClothingTag from '@/components/Tag/ClothingTag'
import LikeButton from '../Button/LikeButton'
import BookmarkButton from '../Button/BookmarkButton'

type CoordishotCardProps = {
  coordishot: CoordishotDetail
}

export default function CoordishotCard({ coordishot }: CoordishotCardProps) {
  const handleLikeChange = (isLiked: boolean, totalLikes: number) => {
    coordishot.like.isLike = isLiked
    coordishot.like.total = totalLikes
  }
  const handleBookmarkToggle = () => {
    coordishot.isBookmark = !coordishot.isBookmark
  }

  return (
    <div className="flex justify-center">
      <Card className="w-[300px] shadow-lg">
        <CardHeader className="p-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={coordishot.user.profileFileId.filePath}
                alt="User Profile"
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
              <span className="text-lg">{coordishot.user.nickname}</span>
            </div>
            <BookmarkButton
              isBookmarked={coordishot.isBookmark}
              boardId={coordishot.boardId}
              userId={coordishot.user.usersId}
              onBookmarkToggle={handleBookmarkToggle}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Image
            src={coordishot.imageFile.filePath}
            alt="Coordishot Image"
            width={300}
            height={300}
            className="w-full"
          />
          {coordishot.tags.map((tag) => (
            <ClothingTag
              key={tag.clothesTagId}
              name={tag.clothes.name}
              x_position={tag.x_position}
              y_position={tag.y_position}
              clothesId={tag.clothesTagId} //TODO: 수정이 필요함
            />
          ))}
          <div className="mt-0 p-4">
            <LikeButton
              boardId={coordishot.boardId}
              userId={coordishot.user.usersId}
              isLiked={coordishot.like.isLike}
              totalLikes={coordishot.like.total}
              onLikeChange={handleLikeChange}
            />
            <div className="px-4">{coordishot.content}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
