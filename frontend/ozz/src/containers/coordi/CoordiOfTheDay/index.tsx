import Link from 'next/link'
import { RxCross2 } from 'react-icons/rx'
import { IoIosArrowDown } from 'react-icons/io'

export default function CoordiOfTheDay({
  selectedDate,
  coordinations,
}: {
  selectedDate: string
  coordinations: { image: string }[]
}) {
  return (
    <div className="m-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          {selectedDate}{' '}
          <span className="bg-secondary text-primary-400 px-0.5">
            #추천_코디
          </span>
        </h1>
        <button className="flex gap-1 items-center bg-gray-light outline outline-gray-dark outline-1 rounded-lg px-3">
          스타일 태그
          <IoIosArrowDown />
        </button>
      </div>
      <div>
        <div className="my-2">
          <span className="bg-primary-100 outline outline-primary-400 py-0.5 px-2 rounded-full text-sm">
            # 전체
          </span>
        </div>
      </div>
      {coordinations.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {coordinations.map((coordination, index) => (
            <img
              key={index}
              src={coordination.image}
              alt={`Coordination ${index + 1}`}
              className="w-full h-auto"
            />
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center">
          <RxCross2 size="90" className="text-gray-dark" />
          <div className="text-center font-semibold">
            <p>AI 코디 추천을 위해서는</p>
            <p>옷장에 더 많은 옷이 필요해요 ㅜ.ㅜ</p>
          </div>
          <Link
            href="/closet"
            className="bg-secondary text-primary-400 rounded-full font-bold mt-8 px-10 py-2"
          >
            내 옷장 바로가기
          </Link>
        </div>
      )}
    </div>
  )
}
