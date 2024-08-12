'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import BrandModal from '@/components/Modal/BrandModal'
import CategoryModal from '@/components/Modal/CategoryModal'
import PurchaseDateModal from '@/components/Modal/PurchaseDateModal'
import PurchaseSiteModal from '@/components/Modal/PurchaseSiteModal'
import SeasonModal from '@/components/Modal/SeasonModal'
import SizeModal from '@/components/Modal/SizeModal'
import FitModal from '@/components/Modal/FitModal'
import TextureModal from '@/components/Modal/TextureModal'
import ColorModal from '@/components/Modal/ColorModal'
import StyleModal from '@/components/Modal/StyleModal'
import PatternModal from '@/components/Modal/PatternModal'
import MemoModal from '@/components/Modal/MemoModal'
import {
  ClothingData,
  Size,
  Fit,
  Season,
  Style,
  Texture,
  Color,
  Pattern,
  fitInvMap,
  seasonInvMap,
  styleInvMap,
  textureInvMap,
  colorMap,
  colorInvMap,
  patternInvMap,
  categoryNameToLowIdMap,
} from '@/types/clothing'
import { ClothesCreateRequest } from '@/types/clothes/data-contracts'
import CameraIcon from '../../../public/icons/camera.svg'

type ClothingFormProps = {
  initialData?: ClothingData
  onSubmit: (imageFile: File, request: object) => void
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
  const [color, setColor] = useState<Color[]>([])
  const [style, setStyle] = useState<Style[]>([])
  const [pattern, setPattern] = useState<Pattern[]>([])
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
      setPattern(initialData.pattern || [])
      setMemo(initialData.memo || null)

      // 이미지 미리보기 설정 (실제 환경에서는 이미지 URL을 사용해야 합니다)
      if (initialData.image) {
        setImageFile(initialData.imageFile)
        setImagePreview(initialData.image)
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
    if (!name || !categoryName || !imageFile || color.length === 0) {
      alert('이름, 카테고리, 색상 및 이미지는 필수 입력 사항입니다.')
      return
    }

    const categoryLowName = categoryName.split(' > ').pop() || ''
    const categoryLowId = categoryNameToLowIdMap[categoryLowName] || undefined

    const request = {
      name,
      size: size || 'FREE',
      fit: fit || undefined,
      memo: memo || '',
      brand: brandName || '',
      purchaseDate: purchaseDate || '',
      purchaseSite: purchaseSite || '',
      colorList: color
        ? color.map(
            (c) =>
              colorInvMap[c.name] as
                | 'WHITE'
                | 'BLACK'
                | 'GRAY'
                | 'RED'
                | 'PINK'
                | 'ORANGE'
                | 'BEIGE'
                | 'YELLOW'
                | 'BROWN'
                | 'GREEN'
                | 'KHAKI'
                | 'MINT'
                | 'BLUE'
                | 'NAVY'
                | 'SKY'
                | 'PURPLE'
                | 'LAVENDER'
                | 'WINE'
                | 'NEON'
                | 'GOLD',
          )
        : [],
      textureList: texture || [],
      seasonList: season || [],
      styleList: style || [],
      patternList: pattern || [],
      categoryLowId,
    }

    Object.entries(request).forEach(([key, value]) => {
      console.log(`${key}: ${value}`)
    })
    onSubmit(imageFile, request)
  }

  function formatValue<T extends string>(
    array: T[],
    map: { [key in string]: string },
  ): string {
    const joined = array.map((item) => map[item]).join(', ')
    return joined.length > 10 ? `${joined.substring(0, 10)}...` : joined
  }

  function formatMemo(note: string) {
    return note.length > 10 ? `${note.substring(0, 10)}...` : note
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
      setValue: (date: string) => setPurchaseDate(date),
    },
    {
      label: '구매처',
      path: 'purchase-site',
      component: PurchaseSiteModal,
      value: purchaseSite,
      setValue: (site: string) => setPurchaseSite(site),
    },
    {
      label: '계절감',
      path: 'season',
      component: SeasonModal,
      value: season ? season.map((s) => seasonInvMap[s]).join(', ') : '',
      setValue: (ss: Season[]) => setSeason(ss),
    },
    {
      label: '사이즈',
      path: 'size',
      component: SizeModal,
      value: size,
      setValue: (s: Size) => setSize(s),
    },
    {
      label: '핏',
      path: 'fit',
      component: FitModal,
      value: fit ? fitInvMap[fit] : '',
      setValue: (f: Fit) => setFit(f),
    },
    {
      label: '소재',
      path: 'texture',
      component: TextureModal,
      value: texture ? formatValue(texture, textureInvMap) : '',
      setValue: (t: Texture[]) => setTexture(t),
    },
    {
      label: '색',
      path: 'color',
      component: ColorModal,
      value: color
        ? formatValue(
            color.map((c) => c.code),
            colorMap,
          )
        : '',
      setValue: (colors: Color[]) => setColor(colors),
    },
    {
      label: '스타일',
      path: 'style',
      component: StyleModal,
      value: style ? formatValue(style, styleInvMap) : '',
      setValue: (st: Style[]) => setStyle(st),
    },
    {
      label: '패턴',
      path: 'pattern',
      component: PatternModal,
      value: pattern ? formatValue(pattern, patternInvMap) : '',
      setValue: (p: Pattern[]) => setPattern(p),
    },
    {
      label: '메모',
      path: 'memo',
      component: MemoModal,
      value: memo ? formatMemo(memo) : '',
      setValue: (m: string) => setMemo(m),
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
            {modalItems.map((item) => (
              <div
                key={item.path}
                className="flex justify-between items-center border-b border-[#000000] border-opacity-30 py-2"
              >
                <span>{item.label}</span>

                <div className="flex justify-center items-center">
                  {item.value &&
                    (item.label === '색' && Array.isArray(color) ? (
                      <>
                        {color.slice(0, 3).map((c) => {
                          return (
                            <div key={c.code} className="flex">
                              <span
                                className="inline-block w-5 h-5 rounded-full mr-1.5"
                                style={{ backgroundColor: c.colorCode }}
                              />
                              <button
                                type="button"
                                className="text-primary-400 mr-2"
                                onClick={() => setOpenModal(item.path)}
                              >
                                {c.name}
                              </button>
                            </div>
                          )
                        })}
                        {color.length > 3 && (
                          <span className="text-primary-400 mr-2">...</span>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        className="text-primary-400 mr-2"
                        onClick={() => setOpenModal(item.path)}
                      >
                        {typeof item.value === 'string' ? item.value : ''}
                      </button>
                    ))}
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
