'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import CameraIcon from '../../../public/icons/camera.svg'
import BrandModal from '@/app/@modal/brand/page'
import CategoryModal from '@/app/@modal/category/page'
import PurchaseDateModal from '@/app/@modal/purchaseDate/page'
import PurchaseSiteModal from '@/app/@modal/purchaseSite/page'
import SeasonModal from '@/app/@modal/season/page'
import SizeModal from '@/app/@modal/size/page'
import FitModal from '@/app/@modal/fit/page'
import TextureModal from '@/app/@modal/texture/page'
import ColorModal from '@/app/@modal/color/page'
import StyleModal from '@/app/@modal/style/page'
import PatternModal from '@/app/@modal/pattern/page'
import MemoModal from '@/app/@modal/memo/page'
import { ClothingData } from '@/types/clothing'

type ClothingFormProps = {
  initialData?: ClothingData
  onSubmit: (data: FormData) => void
  submitButtonText: string
}

const colorMap: { [key: string]: string } = {
  흰색: 'WHITE',
  검정: 'BLACK',
  회색: 'GRAY',
  빨강: 'RED',
  분홍: 'PINK',
  주황: 'ORANGE',
  베이지: 'BEIGE',
  노랑: 'YELLOW',
  갈색: 'BROWN',
  초록: 'GREEN',
  카키: 'KHAKI',
  민트: 'MINT',
  파랑: 'BLUE',
  남색: 'NAVY',
  하늘: 'SKY',
  보라: 'PURPLE',
  연보라: 'LAVENDER',
  와인: 'WINE',
  네온: 'NEON',
  골드: 'GOLD',
}

const textureMap: { [key: string]: string } = {
  무지: 'PLAIN',
  줄무늬: 'STRIPED',
  지그재그: 'ZIGZAG',
  호피: 'LEOPARD',
  지브라: 'ZEBRA',
  아가일: 'ARGYLE',
  도트: 'DOT',
  페이즐리: 'PAISLEY',
  카모플라쥬: 'CAMOUFLAGE',
  플로럴: 'FLORAL',
  레터링: 'LETTERING',
  그래픽: 'GRAPHIC',
  해골: 'SKULL',
  타이다이: 'TIE_DYE',
  깅엄: 'GINGHAM',
  그라데이션: 'GRADATION',
  체크: 'CHECK',
  하운즈투스: 'HOUNDSTOOTH',
}

const seasonMap: { [key: string]: string } = {
  봄: 'SPRING',
  여름: 'SUMMER',
  가을: 'AUTUMN',
  겨울: 'WINTER',
}

const styleMap: { [key: string]: string } = {
  캐주얼: 'CASUAL',
  포멀: 'FORMAL',
  스트릿: 'STREET',
  스포츠: 'SPORTS',
  빈티지: 'VINTAGE',
}

const fitMap: { [key: string]: string } = {
  오버핏: 'OVERSIZE',
  세이오버핏: 'SEMIOVER',
  레귤러핏: 'REGULAR',
  슬림핏: 'SLIM',
}

export default function ClothingForm({
  initialData,
  onSubmit,
  submitButtonText,
}: ClothingFormProps) {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [categoryName, setCategoryName] = useState<string | null>(null)
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null)
  const [purchaseSite, setPurchaseSite] = useState<string | null>(null)
  const [season, setSeason] = useState<string[]>([])
  const [size, setSize] = useState<string | null>(null)
  const [fit, setFit] = useState<string | null>(null)
  const [texture, setTexture] = useState<string[]>([])
  const [color, setColor] = useState<{ name: string; code: string }[] | null>(
    [],
  )
  const [style, setStyle] = useState<string[]>([])
  const [pattern, setPattern] = useState<{ name: string; img: string } | null>(
    null,
  )
  const [memo, setMemo] = useState<string | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setBrandName(initialData.brandName || '')
      setCategoryName(initialData.categoryName || null)
      setPurchaseDate(initialData.purchaseDate || null)
      setPurchaseSite(initialData.purchaseSite || null)
      setSeason(initialData.season || [])
      setSize(initialData.size || null)
      setFit(initialData.fit || null)
      setTexture(initialData.texture || [])
      setColor(initialData.color || [])
      setStyle(initialData.style || [])
      setPattern(initialData.pattern || null)
      setMemo(initialData.memo || null)

      // 이미지 미리보기 설정 (실제 환경에서는 이미지 URL을 사용해야 합니다)
      if (initialData.image) {
        setImagePreview(URL.createObjectURL(initialData.image))
      }
    }
  }, [initialData])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 필수 입력 필드 확인
    if (!name || !categoryName || !imageFile) {
      alert('이름, 카테고리 및 이미지는 필수 입력 사항입니다.')
      return
    }

    const categoryLowId = categoryName.split(' > ').pop() || ''

    const jsonData = {
      name,
      size: size || 'FREE',
      fit: fit ? fitMap[fit] : '',
      memo: memo || '',
      brand: brandName || '',
      purchaseDate: purchaseDate || '',
      purchaseSite: purchaseSite || '',

      colorList: color ? color.map((c) => colorMap[c.name]) : [],
      textureList: texture.map((t) => textureMap[t]),
      seasonList: season ? season.map((s) => seasonMap[s]) : [],
      styleList: style ? style.map((s) => styleMap[s]) : [],
      categoryLowId,
    }

    const formData = new FormData()
    formData.append('imageFile', imageFile as File)
    formData.append(
      'data',
      new Blob([JSON.stringify(jsonData)], { type: 'application/json' }),
    )

    onSubmit(formData)

    console.log('옷 등록할게요 ><')
    for (const x of formData.entries()) {
      console.log(x)
    }

    // try {
    //   const response = await fetch('/api/clothes', {
    //     method: 'POST',
    //     body: formData,
    //   })
    //   if (response.ok) {
    //     console.log('옷 등록 성공!')
    //   } else {
    //     console.log('옷 등록 실패!')
    //   }
    // } catch (error) {
    //   console.error('옷 등록 에러:', error)
    // }
  }

  const closeModal = () => setOpenModal(null)

  const modalItems = [
    {
      label: '브랜드',
      path: 'brand',
      component: BrandModal,
      value:
        brandName.length > 10 ? `${brandName.substring(0, 10)}...` : brandName,
      setValue: (brand: string) => setBrandName(brand),
    },
    {
      label: '카테고리',
      path: 'category',
      component: CategoryModal,
      value: categoryName,
      setValue: (category: string) => setCategoryName(category),
    },
    {
      label: '구매일자',
      path: 'purchase-date',
      component: PurchaseDateModal,
      value: purchaseDate,
      setValue: (purchaseDate: string) => setPurchaseDate(purchaseDate),
    },
    {
      label: '구매처',
      path: 'purchase-site',
      component: PurchaseSiteModal,
      value: purchaseSite,
      setValue: (purchaseSite: string) => setPurchaseSite(purchaseSite),
    },
    {
      label: '계절감',
      path: 'season',
      component: SeasonModal,
      value: season ? season.join(', ') : '',
      setValue: (season: string[]) => setSeason(season),
    },
    {
      label: '사이즈',
      path: 'size',
      component: SizeModal,
      value: size,
      setValue: (size: string) => setSize(size),
    },
    {
      label: '핏',
      path: 'fit',
      component: FitModal,
      value: fit,
      setValue: (fit: string) => setFit(fit),
    },
    {
      label: '소재',
      path: 'texture',
      component: TextureModal,
      value:
        texture.join(', ').length > 10
          ? `${texture.join(', ')}...`
          : texture.join(', '),
      setValue: (texture: string[]) => setTexture(texture),
    },
    {
      label: '색',
      path: 'color',
      component: ColorModal,
      value: color ? color : '',
      setValue: (colors: { name: string; code: string }[]) => setColor(colors),
    },
    {
      label: '스타일',
      path: 'style',
      component: StyleModal,
      value: style
        ? style.join(', ').length > 10
          ? `${style.join(', ')}...`
          : style.join(', ')
        : '',
      setValue: (style: string[]) => setStyle(style),
    },
    {
      label: '패턴',
      path: 'pattern',
      component: PatternModal,
      value: pattern ? pattern.name : '',
      setValue: (pattern: { name: string; img: string }) => setPattern(pattern),
    },
    {
      label: '메모',
      path: 'memo',
      component: MemoModal,
      value: memo
        ? memo.length > 10
          ? `${memo.substring(0, 10)}...`
          : memo
        : '',
      setValue: (memo: string) => setMemo(memo),
    },
  ]

  return (
    <div className="py-12 px-10 min-h-screen flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-3">
          <input
            type="file"
            name="image"
            id="image"
            className="sr-only"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className={`relative flex min-h-[300px] min-w-[300px] items-center justify-center text-center rounded-lg ${imagePreview ? 'border-none' : 'border border-secondary'} `}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                width={300}
                height={300}
                className="p-6"
              />
            ) : (
              <div>
                <Image
                  src={CameraIcon}
                  alt="camera"
                  width={100}
                  className="opacity-50"
                />
                <span className="mb-2 block text-sm font-semibold text-[#000000] opacity-20">
                  옷 이미지 등록
                </span>
              </div>
            )}
          </label>
        </div>
        <div className="bg-secondary p-5 max-w-[300px] rounded-lg">
          <div className="flex items-center mb-5 ">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="이름 입력"
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              className="flex-1 py-2 text-center bg-secondary font-extrabold text-lg
                    text-primary-400 placeholder:text-gray-light outline-none truncate"
            />
          </div>
          {/* Form */}
          <div className="w-full max-w-md text-gray-light rounded-lg shadow-md space-y-2 mb-4">
            {modalItems.map((item, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-[#000000] border-opacity-30 py-2"
              >
                <span>{item.label}</span>

                <div className="flex justify-center items-center">
                  {item.value && (
                    <>
                      {item.label === '색' && Array.isArray(color) ? (
                        <>
                          {color.slice(0, 3).map((c, index) => (
                            <div key={c.code} className="flex">
                              <span
                                className="inline-block w-5 h-5 rounded-full mr-1.5"
                                style={{ backgroundColor: c.code }}
                              ></span>
                              <span
                                className="text-primary-400 mr-2"
                                onClick={() => setOpenModal(item.path)}
                              >
                                {c.name}
                              </span>
                            </div>
                          ))}
                          {color.length > 3 && (
                            <span className="text-primary-400 mr-2">...</span>
                          )}
                        </>
                      ) : (
                        <span
                          className="text-primary-400 mr-2"
                          onClick={() => setOpenModal(item.path)}
                        >
                          {typeof item.value === 'string' ? item.value : ''}
                        </span>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setOpenModal(item.path)}
                    className=""
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center align-middle">
            <button
              type="submit"
              className="px-8 w-[180px] h-[40px] bg-primary-400 align-middle rounded-3xl text-secondary text-md font-bold"
            >
              {submitButtonText}
            </button>
          </div>
          z {/* Modals */}
          {modalItems.map(
            ({ path, component: ModalComponent, setValue }) =>
              openModal === path && (
                <ModalComponent
                  key={path}
                  onClose={closeModal}
                  // setValue의 타입이 여러가지라 발생하는 에러
                  setValue={setValue}
                />
              ),
          )}
        </div>
      </form>
    </div>
  )
}
