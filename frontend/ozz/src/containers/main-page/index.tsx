import { FaCirclePlus } from 'react-icons/fa6'

export default function MainPageContainer() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-96 bg-secondary text-gray-light">
        <img className="w-28" src="/images/logo_blank_green.png" alt="ozz" />
        <h1 className="text-xl font-bold mt-2">OZZ : 옷짱</h1>
        <p className="text-center mt-8">
          옷장에 옷을 등록하면 <br />
          AI가 오늘 날씨에 맞는 옷을 추천해 줄 거예요!
        </p>
      </div>
      <div>
        <h2 className="text-xl font-bold m-3">
          <span className="bg-secondary text-primary-400 px-0.5">OZZ</span> 님의
          옷장
        </h2>
        <div className="mx-3 h-36 bg-primary-50 flex flex-col justify-center items-center">
          <p>옷 등록하기</p>
          <FaCirclePlus />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold m-3">
          <span className="bg-secondary text-primary-400 px-0.5">OZZ</span> 님의
          코디북
        </h2>
        <div className="mx-3 h-36 bg-primary-50 flex flex-col justify-center items-center">
          <p>코디 등록하기</p>
          <FaCirclePlus />
        </div>
      </div>
    </>
  )
}
