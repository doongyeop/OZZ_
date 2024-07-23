import Image from 'next/image'
import CameraIcon from '../../../public/icons/camera.svg'

// export default function Form({clothes} : {clothes: ClothesField}) {
export default function Form() {

return (

<div className="py-32 px-10 min-h-screen flex flex-col justify-center items-center">
  <form action="">
    <div className="flex justify-center mb-3">
      <input type="file" name="image" id="image" className="sr-only" />
        <label
          htmlFor="image"
          className="relative flex min-h-[300px] min-w-[300px] items-center justify-center rounded-lg border border-secondary p-12 text-center"
        >
          <div>
            <Image src={CameraIcon} alt="camera" width={100} className="opacity-50"/>
            <span className="mb-2 block text-sm font-semibold text-[#000000] opacity-20">
              옷 이미지 등록
            </span>
          </div>
        </label>
    </div>
    <div className='bg-secondary p-5 max-w-[300px] rounded-lg'>
      <div className="flex items-center mb-5 ">
        <input type="text" id="name" name="name" placeholder="이름 입력" autoComplete='off'
            className="flex-1 py-2 text-center bg-secondary font-extrabold text-lg
                    text-gray-light outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left 
                                 font-extrabold text-md text-gray-light">브랜드</label>
        <input type="text" id="brand" name="brand" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">카테고리</label>
        <input type="text" id="category" name="category" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>
      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">구매일자</label>
        <input type="date" id="purchase_date" name="purchase_date" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">구매처</label>
        <input type="text" id="purchase_site" name="purchase_site" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">계절감</label>
        <input type="text" id="season_list" name="season_list" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">구매처</label>
        <input type="text" id="purchase_site" name="purchase_site" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">사이즈</label>
        <input type="text" id="size" name="size" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">핏</label>
        <input type="text" id="fit" name="fit" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">소재</label>
        <input type="text" id="texture" name="texture" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">색</label>
        <input type="text" id="color" name="color" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">스타일</label>
        <input type="text" id="style_list" name="style_list" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">패턴</label>
        <input type="text" id="pattern" name="pattern" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center mb-5">
        <label htmlFor="name" className="inline-block w-20 text-left whitespace-nowrap
                                 font-extrabold text-md text-gray-light">메모</label>
        <input type="text" id="memo" name="memo" autoComplete='off'
               className="flex-1 py-2 text-right bg-secondary font-extrabold text-md
                    text-primary-400 outline-none"/>
      </div>

      <div className="flex items-center justify-center align-middle">
        <button className="px-8 w-[180px] h-[40px] bg-primary-400 align-middle rounded-3xl text-secondary text-md font-bold">등록하기</button> 
        
      </div>
      </div>
    </form>

</div>
)

}