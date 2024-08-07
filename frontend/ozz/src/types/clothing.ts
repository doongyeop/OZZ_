export type Size = 'FREE' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type Fit = 'OVER_FIT' | 'SEMI_OVER_FIT' | 'REGULAR_FIT' | 'SLIM_FIT'
export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER'
export type Style =
  | 'FORMAL'
  | 'MANNISH'
  | 'ELEGANCE'
  | 'ETHNIC'
  | 'MODERN'
  | 'NATURAL'
  | 'ROMANTIC'
  | 'SPORTY'
  | 'STREET'
  | 'CASUAL'
export type Texture =
  | 'FUR'
  | 'KNIT'
  | 'MOUTON'
  | 'LACE'
  | 'SUEDE'
  | 'LINEN'
  | 'ANGORA'
  | 'MESH'
  | 'CORDUROY'
  | 'FLEECE'
  | 'SEQUIN_GLITTER'
  | 'NEOPRENE'
  | 'DENIM'
  | 'SILK'
  | 'JERSEY'
  | 'SPANDEX'
  | 'TWEED'
  | 'JACQUARD'
  | 'VELVET'
  | 'LEATHER'
  | 'VINYL_PVC'
  | 'COTTON'
  | 'WOOL_CASHMERE'
  | 'CHIFFON'
  | 'SYNTHETIC_POLYESTER'
export type Color =
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
  | 'GOLD'
export type Pattern =
  | 'SOLID'
  | 'STRIPED'
  | 'ZIGZAG'
  | 'LEOPARD'
  | 'ZEBRA'
  | 'ARGYLE'
  | 'DOT'
  | 'PAISLEY'
  | 'CAMOUFLAGE'
  | 'FLORAL'
  | 'LETTERING'
  | 'GRAPHIC'
  | 'SKULL'
  | 'TIE_DYE'
  | 'GINGHAM'
  | 'GRADATION'
  | 'CHECK'
  | 'HOUNDSTOOTH'

export interface ClothingData {
  id: number
  name: string
  brandName: string
  categoryName: string | null
  purchaseDate: string | null
  purchaseSite: string | null
  season: Season[] | null
  size: Size | null
  fit: Fit | null
  texture: Texture[]
  color: { name: string; code: string }[] | null
  style: Style[] | null
  pattern: { name: string; img: string } | null
  memo: string | null
  image: File | null
}

export const sizeMap: { [key: string]: Size } = {
  FREE: 'FREE',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
}
export const colorMap: { [key: string]: Color } = {
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

export const textureMap: { [key: string]: Texture } = {
  퍼: 'FUR',
  니트: 'KNIT',
  무톤: 'MOUTON',
  레이스: 'LACE',
  스웨이드: 'SUEDE',
  린넨: 'LINEN',
  앙고라: 'ANGORA',
  메쉬: 'MESH',
  코듀로이: 'CORDUROY',
  플리스: 'FLEECE',
  시퀸글리터: 'SEQUIN_GLITTER',
  네오프렌: 'NEOPRENE',
  데님: 'DENIM',
  실크: 'SILK',
  저지: 'JERSEY',
  스판덱스: 'SPANDEX',
  트위드: 'TWEED',
  자카드: 'JACQUARD',
  벨벳: 'VELVET',
  가죽: 'LEATHER',
  비닐: 'VINYL_PVC',
  면: 'COTTON',
  울: 'WOOL_CASHMERE',
  쉬폰: 'CHIFFON',
  폴리: 'SYNTHETIC_POLYESTER',
}

export const textureInvMap: { [key in Texture]: string } = {
  FUR: '퍼',
  KNIT: '니트',
  MOUTON: '무톤',
  LACE: '레이스',
  SUEDE: '스웨이드',
  LINEN: '린넨',
  ANGORA: '앙고라',
  MESH: '메쉬',
  CORDUROY: '코듀로이',
  FLEECE: '플리스',
  SEQUIN_GLITTER: '시퀸글리터',
  NEOPRENE: '네오프렌',
  DENIM: '데님',
  SILK: '실크',
  JERSEY: '저지',
  SPANDEX: '스판덱스',
  TWEED: '트위드',
  JACQUARD: '자카드',
  VELVET: '벨벳',
  LEATHER: '가죽',
  VINYL_PVC: '비닐',
  COTTON: '면',
  WOOL_CASHMERE: '울',
  CHIFFON: '쉬폰',
  SYNTHETIC_POLYESTER: '폴리',
}

export const seasonMap: { [key: string]: Season } = {
  봄: 'SPRING',
  여름: 'SUMMER',
  가을: 'AUTUMN',
  겨울: 'WINTER',
}

export const seasonInvMap: { [key: string]: string } = {
  SPRING: '봄',
  SUMMER: '여름',
  AUTUMN: '가을',
  WINTER: '겨울',
}

export const styleMap: { [key: string]: Style } = {
  포멀: 'FORMAL',
  매니시: 'MANNISH',
  엘레강스: 'ELEGANCE',
  에스닉: 'ETHNIC',
  모던: 'MODERN',
  내추럴: 'NATURAL',
  로맨틱: 'ROMANTIC',
  스포티: 'SPORTY',
  스트릿: 'STREET',
  캐주얼: 'CASUAL',
}

export const styleInvMap: { [key in Style]: string } = {
  FORMAL: '포멀',
  MANNISH: '매니시',
  ELEGANCE: '엘레강스',
  ETHNIC: '에스닉',
  MODERN: '모던',
  NATURAL: '내추럴',
  ROMANTIC: '로맨틱',
  SPORTY: '스포티',
  STREET: '스트릿',
  CASUAL: '캐주얼',
}

export const fitMap: { [key: string]: Fit } = {
  오버핏: 'OVER_FIT',
  세미오버핏: 'SEMI_OVER_FIT',
  레귤러핏: 'REGULAR_FIT',
  슬림핏: 'SLIM_FIT',
}
export const fitInvMap: Record<Fit, string> = {
  OVER_FIT: '오버핏',
  SEMI_OVER_FIT: '세미오버핏',
  REGULAR_FIT: '레귤러핏',
  SLIM_FIT: '슬림핏',
}

export const patternMap: { [key: string]: Pattern } = {
  단색: 'SOLID',
  줄무늬: 'STRIPED',
  지그재그: 'ZIGZAG',
  호피: 'LEOPARD',
  지브라: 'ZEBRA',
  아가일: 'ARGYLE',
  도트: 'DOT',
  페이즐리: 'PAISLEY',
  카모플라주: 'CAMOUFLAGE',
  플로럴: 'FLORAL',
  레터링: 'LETTERING',
  그래픽: 'GRAPHIC',
  해골: 'SKULL',
  타이다이: 'TIE_DYE',
  깅엄: 'GINGHAM',
  그라데이션: 'GRADATION',
  체크: 'CHECK',
  하운드투스: 'HOUNDSTOOTH',
}

export const keyLabelMap: { [key: string]: string } = {
  brandName: '브랜드',
  categoryName: '카테고리',
  purchaseDate: '구매일자',
  purchaseSite: '구매처',
  season: '계절',
  size: '사이즈',
  fit: '핏',
  texture: '소재',
  color: '색상',
  style: '스타일',
  pattern: '패턴',
  memo: '메모',
}
