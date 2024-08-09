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
  color: Color[] | null
  style: Style[] | null
  pattern: Pattern[] | null
  memo: string | null
  image: File | null
}

export interface Color {
  code: ColorCode
  name: string
  colorCode: string
}

export type Size = 'FREE' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type Fit = 'OVER_FIT' | 'SEMI_OVER_FIT' | 'REGULAR_FIT' | 'SLIM_FIT'
export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER'
export type Style =
  | 'FORMAL'
  | 'MANNISH'
  | 'ELEGANT'
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
export type ColorCode =
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

export const colors: Color[] = [
  { code: 'WHITE', name: '흰색', colorCode: '#FFFFFF' },
  { code: 'BLACK', name: '검정', colorCode: '#000000' },
  { code: 'GRAY', name: '회색', colorCode: '#E7E7E7' },
  { code: 'RED', name: '빨강', colorCode: '#FF0000' },
  { code: 'PINK', name: '분홍', colorCode: '#FEE0DE' },
  { code: 'ORANGE', name: '주황', colorCode: '#FF820E' },
  { code: 'BEIGE', name: '베이지', colorCode: '#E2C79C' },
  { code: 'YELLOW', name: '노랑', colorCode: '#FEE600' },
  { code: 'BROWN', name: '갈색', colorCode: '#844F1D' },
  { code: 'GREEN', name: '초록', colorCode: '#1A9268' },
  { code: 'KHAKI', name: '카키', colorCode: '#666B17' },
  { code: 'MINT', name: '민트', colorCode: '#6BF1D8' },
  { code: 'BLUE', name: '파랑', colorCode: '#1F4CE3' },
  { code: 'NAVY', name: '남색', colorCode: '#060350' },
  { code: 'SKY', name: '하늘', colorCode: '#C5E3FF' },
  { code: 'PURPLE', name: '보라', colorCode: '#9C53BE' },
  { code: 'LAVENDER', name: '연보라', colorCode: '#D7BEF5' },
  { code: 'WINE', name: '와인', colorCode: '#9E213F' },
  { code: 'NEON', name: '네온', colorCode: '#2FF40A' },
  { code: 'GOLD', name: '골드', colorCode: '#E6C345' },
]

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
export type CategoryHigh =
  | '상의'
  | '하의'
  | '아우터'
  | '원피스'
  | '신발'
  | '악세서리'
  | '가방'

export type CategoryLow =
  | '탑'
  | '블라우스'
  | '티셔츠'
  | '니트웨어'
  | '셔츠'
  | '브라탑'
  | '후드티'
  | '청바지'
  | '팬츠'
  | '스커트'
  | '레깅스'
  | '조거팬츠'
  | '코트'
  | '재킷'
  | '점퍼'
  | '패딩'
  | '베스트'
  | '가디건'
  | '짚업'
  | '드레스'
  | '점프수트'
  | '운동화'
  | '구두'
  | '샌들/슬리퍼'
  | '주얼리'
  | '기타'
  | '모자'
  | '백팩'
  | '힙색'

export const sizeMap: { [key: string]: Size } = {
  FREE: 'FREE',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
}

export const textureMap: { [key: string]: Texture } = {
  퍼: 'FUR',
  니트: 'KNIT',
  무스탕: 'MOUTON',
  레이스: 'LACE',
  스웨이드: 'SUEDE',
  린넨: 'LINEN',
  앙고라: 'ANGORA',
  메시: 'MESH',
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
  MOUTON: '무스탕',
  LACE: '레이스',
  SUEDE: '스웨이드',
  LINEN: '린넨',
  ANGORA: '앙고라',
  MESH: '메시',
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
  엘레강스: 'ELEGANT',
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
  ELEGANT: '엘레강스',
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
  무지: 'SOLID',
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
export const patternInvMap: { [key: string]: string } = {
  SOLID: '무지',
  STRIPED: '줄무늬',
  ZIGZAG: '지그재그',
  LEOPARD: '호피',
  ZEBRA: '지브라',
  ARGYLE: '아가일',
  DOT: '도트',
  PAISLEY: '페이즐리',
  CAMOUFLAGE: '카모플라쥬',
  FLORAL: '플로럴',
  LETTERING: '레터링',
  GRAPHIC: '그래픽',
  SKULL: '해골',
  TIE_DYE: '타이다이',
  GINGHAM: '깅엄',
  GRADATION: '그라데이션',
  CHECK: '체크',
  HOUNDSTOOTH: '하운즈투스',
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

// 카테고리 매핑
export interface CategoryMap {
  [key: string]: { id: number; subcategories: { [key: string]: number } }
}

export const categoryMap: CategoryMap = {
  상의: {
    id: 1,
    subcategories: {
      탑: 1,
      블라우스: 2,
      티셔츠: 3,
      니트웨어: 4,
      셔츠: 5,
      브라탑: 6,
      후드티: 7,
    },
  },
  하의: {
    id: 2,
    subcategories: {
      청바지: 8,
      팬츠: 9,
      스커트: 10,
      레깅스: 11,
      조거팬츠: 12,
    },
  },
  아우터: {
    id: 3,
    subcategories: {
      코트: 13,
      재킷: 14,
      점퍼: 15,
      패딩: 16,
      베스트: 17,
      가디건: 18,
      짚업: 19,
    },
  },
  원피스: {
    id: 4,
    subcategories: {
      드레스: 20,
      점프수트: 21,
    },
  },
  신발: {
    id: 5,
    subcategories: {
      운동화: 22,
      구두: 23,
      '샌들/슬리퍼': 24,
    },
  },
  악세서리: {
    id: 6,
    subcategories: {
      주얼리: 25,
      기타: 26,
      모자: 27,
    },
  },
  가방: {
    id: 7,
    subcategories: {
      백팩: 28,
      힙색: 29,
    },
  },
}

export const categoryLowIdToNameMap: { [key: number]: string } = {
  1: '탑',
  2: '블라우스',
  3: '티셔츠',
  4: '니트웨어',
  5: '셔츠',
  6: '브라탑',
  7: '후드티',
  8: '청바지',
  9: '팬츠',
  10: '스커트',
  11: '레깅스',
  12: '조거팬츠',
  13: '코트',
  14: '재킷',
  15: '점퍼',
  16: '패딩',
  17: '베스트',
  18: '가디건',
  19: '짚업',
  20: '드레스',
  21: '점프수트',
  22: '운동화',
  23: '구두',
  24: '샌들/슬리퍼',
  25: '주얼리',
  26: '기타',
  27: '모자',
  28: '백팩',
  29: '힙색',
}
export const categoryNameToLowIdMap: { [key: string]: number } = {
  탑: 1,
  블라우스: 2,
  티셔츠: 3,
  니트웨어: 4,
  셔츠: 5,
  브라탑: 6,
  후드티: 7,
  청바지: 8,
  팬츠: 9,
  스커트: 10,
  레깅스: 11,
  조거팬츠: 12,
  코트: 13,
  재킷: 14,
  점퍼: 15,
  패딩: 16,
  베스트: 17,
  가디건: 18,
  짚업: 19,
  드레스: 20,
  점프수트: 21,
  운동화: 22,
  구두: 23,
  '샌들/슬리퍼': 24,
  주얼리: 25,
  기타: 26,
  모자: 27,
  백팩: 28,
  힙색: 29,
}

export const colorMap: { [key: string]: string } = {
  WHITE: '흰색',
  BLACK: '검정',
  GRAY: '회색',
  RED: '빨강',
  PINK: '분홍',
  ORANGE: '주황',
  BEIGE: '베이지',
  YELLOW: '노랑',
  BROWN: '갈색',
  GREEN: '초록',
  KHAKI: '카키',
  MINT: '민트',
  BLUE: '파랑',
  NAVY: '남색',
  SKY: '하늘',
  PURPLE: '보라',
  LAVENDER: '연보라',
  WINE: '와인',
  NEON: '네온',
  GOLD: '골드',
}

export const colorInvMap: { [key: string]: string } = {
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
