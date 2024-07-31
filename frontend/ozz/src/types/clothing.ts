export interface ClothingData {
  id: number
  name: string
  brandName: string
  categoryName: string | null
  purchaseDate: string | null
  purchaseSite: string | null
  season: string[] | null
  size: string | null
  fit: string | null
  texture: string[]
  color: { name: string; code: string } | null
  style: string[] | null
  pattern: { name: string; img: string } | null
  memo: string | null
  image: File | null
}
