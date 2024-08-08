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
import {
  ClothingData,
  Size,
  Fit,
  Season,
  Style,
  Texture,
  Color,
  Pattern,
  sizeMap,
  fitMap,
  fitInvMap,
  seasonMap,
  seasonInvMap,
  styleMap,
  styleInvMap,
  textureMap,
  textureInvMap,
  colorMap,
  colorInvMap,
  patternMap,
  categoryNameToLowIdMap,
} from '@/types/clothing'
import { ClothesCreateRequest } from '@/types/clothes/data-contracts'

type ClothingFormProps = {
  initialData?: ClothingData
  onSubmit: (imageFile: File, request: ClothesCreateRequest) => void
  submitButtonText: string
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
  const [season, setSeason] = useState<Season[]>([])
  const [size, setSize] = useState<Size>('FREE')
  const [fit, setFit] = useState<Fit | null>(null)
  const [texture, setTexture] = useState<Texture[]>([])
  const [color, setColor] = useState<Color[] | null>([])
  const [style, setStyle] = useState<Style[]>([])
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
      setCategoryName(initialData.categoryName || '')
      setPurchaseDate(initialData.purchaseDate || null)
      setPurchaseSite(initialData.purchaseSite || null)
      setSeason(initialData.season || [])
      setSize(initialData.size || 'FREE')
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

    const categoryLowName = categoryName.split(' > ').pop() || ''
    const categoryLowId = categoryNameToLowIdMap[categoryLowName] || undefined

    const request: ClothesCreateRequest = {
      name,
      size: size || 'FREE',
      fit: fit ? fitMap[fit] : undefined,
      memo: memo || '',
      brand: brandName || '',
      purchaseDate: purchaseDate || '',
      purchaseSite: purchaseSite || '',
      colorList: color ? color.map((c) => colorInvMap[c.name]) : [],
      textureList: texture.map((t) => textureMap[t]),
      seasonList: season ? season.map((s) => seasonMap[s]) : [],
      styleList: style ? style.map((s) => styleMap[s]) : [],
      categoryLowId,
    }

    // console.log('옷 등록할게요 ><')
    // console.log(imageFile.type)
    // console.log(request)
    // Object.entries(request).forEach(([key, value]) => {
    //   console.log(`${key}: ${value}`)
    // })
    onSubmit(imageFile, request)
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
      value: season ? season.map((s) => seasonInvMap[s]).join(', ') : '',
      setValue: (season: Season[]) => setSeason(season),
    },
    {
      label: '사이즈',
      path: 'size',
      component: SizeModal,
      value: size,
      setValue: (size: Size) => setSize(size),
    },
    {
      label: '핏',
      path: 'fit',
      component: FitModal,
      value: fit ? fitInvMap[fit] : '',
      setValue: (fit: Fit) => setFit(fit),
    },
    {
      label: '소재',
      path: 'texture',
      component: TextureModal,
      value:
        texture.join(', ').length > 10
          ? texture.map((t) => textureInvMap[t]).join(', ')
          : '',
      setValue: (texture: Texture[]) => setTexture(texture),
    },
    {
      label: '색',
      path: 'color',
      component: ColorModal,
      value: color
        ? color.map((c) => c.name).join(', ').length > 10
          ? `${color.map((c) => c.name).join(', ')}...`
          : color.map((c) => c.name).join(', ')
        : '',
      setValue: (colors: Color[]) => setColor(colors),
    },
    {
      label: '스타일',
      path: 'style',
      component: StyleModal,
      value: style
        ? style.map((s) => styleInvMap[s]).join(', ').length > 10
          ? `${style.map((s) => styleInvMap[s]).join(', ')}...`
          : style.map((s) => styleInvMap[s]).join(', ')
        : '',
      setValue: (style: Style[]) => setStyle(style),
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
            className={`relative flex min-h-[300px] min-w-[300px] max-h-[300px] max-w-[300px] items-center justify-center text-center rounded-lg ${imagePreview ? 'border-none' : 'border border-secondary'} `}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                width={300}
                height={300}
                className="p-6 object-cover"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
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
                                style={{ backgroundColor: c.colorCode }}
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
          {/* Modals */}
          {openModal === 'brand' && (
            <BrandModal onClose={closeModal} setValue={setBrandName} />
          )}
          {openModal === 'category' && (
            <CategoryModal onClose={closeModal} setValue={setCategoryName} />
          )}
          {openModal === 'purchase-date' && (
            <PurchaseDateModal
              onClose={closeModal}
              setValue={setPurchaseDate}
            />
          )}
          {openModal === 'purchase-site' && (
            <PurchaseSiteModal
              onClose={closeModal}
              setValue={setPurchaseSite}
            />
          )}
          {openModal === 'season' && (
            <SeasonModal onClose={closeModal} setValue={setSeason} />
          )}
          {openModal === 'size' && (
            <SizeModal onClose={closeModal} setValue={setSize} />
          )}
          {openModal === 'fit' && (
            <FitModal onClose={closeModal} setValue={setFit} />
          )}
          {openModal === 'texture' && (
            <TextureModal onClose={closeModal} setValue={setTexture} />
          )}
          {openModal === 'color' && (
            <ColorModal onClose={closeModal} setValue={setColor} />
          )}
          {openModal === 'style' && (
            <StyleModal onClose={closeModal} setValue={setStyle} />
          )}
          {openModal === 'pattern' && (
            <PatternModal onClose={closeModal} setValue={setPattern} />
          )}
          {openModal === 'memo' && (
            <MemoModal onClose={closeModal} setValue={setMemo} />
          )}
        </div>
      </form>
    </div>
  )
}
