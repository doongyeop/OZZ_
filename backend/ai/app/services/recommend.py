import logging
import os

import requests

from app.core.client.outfitRecommend import OutfitRecommendation
from app.schemas.recommend import Clothes, Recommend, Consider


class RecommendService:
    def __init__(self):
        pass

    def get_user_clothes(self, user_id):
        # 엔드포인트 URL 및 clothesId 설정
        # url = f"{os.getenv('CLOTHES_ENDPOINT')}/api/clothes/all"
        #
        # logging.info(f"Try load {user_id}'s clothes")
        #
        # # patch 요청 보내기
        # response = requests.get(url, headers={"X-User-Id": user_id})
        #
        # logging.info(f"Loaded {user_id}'s clothes"+response.json())

        # 테스트 목업 데이터
        mock={
    "top_01": {
        "fit": "SLIM_FIT",
        "colorList": ["BLACK", "WHITE"],
        "patternList": ["SOLID"],
        "seasonList": ["SUMMER"],
        "styleList": ["CASUAL"],
        "textureList": ["COTTON"],
        "extra": "basic design, breathable",
        "category": "탑"
    },
    "top_02": {
        "fit": "OVERSIZED",
        "colorList": ["BLUE", "WHITE"],
        "patternList": ["STRIPES"],
        "seasonList": ["SPRING", "SUMMER"],
        "styleList": ["STREET"],
        "textureList": ["LINEN"],
        "extra": "relaxed fit, comfortable",
        "category": "블라우스"
    },
    "top_03": {
        "fit": "REGULAR_FIT",
        "colorList": ["RED"],
        "patternList": ["FLORAL"],
        "seasonList": ["SPRING"],
        "styleList": ["FEMININE"],
        "textureList": ["SILK"],
        "extra": "floral print, soft texture",
        "category": "티셔츠"
    },
    "top_04": {
        "fit": "CROPPED",
        "colorList": ["YELLOW"],
        "patternList": ["SOLID"],
        "seasonList": ["SUMMER"],
        "styleList": ["CASUAL"],
        "textureList": ["COTTON"],
        "extra": "cropped design, lightweight",
        "category": "브라탑"
    },
    "top_05": {
        "fit": "OVERSIZED",
        "colorList": ["GREY"],
        "patternList": ["LETTERING"],
        "seasonList": ["AUTUMN", "WINTER"],
        "styleList": ["SPORTY"],
        "textureList": ["COTTON"],
        "extra": "cozy fabric, sporty style",
        "category": "맨투맨"
    },
    "bottom_01": {
        "fit": "REGULAR_FIT",
        "colorList": ["DARK_BLUE"],
        "patternList": ["SOLID"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["CASUAL"],
        "textureList": ["DENIM"],
        "extra": "classic design, durable",
        "category": "청바지"
    },
    "bottom_02": {
        "fit": "SLIM_FIT",
        "colorList": ["BLACK"],
        "patternList": ["SOLID"],
        "seasonList": ["AUTUMN", "WINTER"],
        "styleList": ["FORMAL"],
        "textureList": ["WOOL"],
        "extra": "warm fabric, sleek design",
        "category": "팬츠"
    },
    "bottom_03": {
        "fit": "A-LINE",
        "colorList": ["PINK"],
        "patternList": ["CHECK"],
        "seasonList": ["SPRING", "SUMMER"],
        "styleList": ["FEMININE"],
        "textureList": ["COTTON"],
        "extra": "comfortable fit, light texture",
        "category": "스커트"
    },
    "bottom_04": {
        "fit": "BODY_FIT",
        "colorList": ["GREY"],
        "patternList": ["SOLID"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["SPORTY"],
        "textureList": ["SPANDEX"],
        "extra": "stretchable fabric, activewear",
        "category": "레깅스"
    },
    "bottom_05": {
        "fit": "RELAXED_FIT",
        "colorList": ["GREEN"],
        "patternList": ["CAMO"],
        "seasonList": ["AUTUMN", "WINTER"],
        "styleList": ["STREET"],
        "textureList": ["COTTON"],
        "extra": "loose fit, casual style",
        "category": "조거팬츠"
    },
    "outer_01": {
        "fit": "TAILORED",
        "colorList": ["NAVY"],
        "patternList": ["SOLID"],
        "seasonList": ["AUTUMN", "WINTER"],
        "styleList": ["FORMAL"],
        "textureList": ["WOOL"],
        "extra": "classic design, tailored fit",
        "category": "코트"
    },
    "outer_02": {
        "fit": "OVERSIZED",
        "colorList": ["BEIGE"],
        "patternList": ["PLAID"],
        "seasonList": ["SPRING", "AUTUMN"],
        "styleList": ["CASUAL"],
        "textureList": ["COTTON"],
        "extra": "comfortable, easy layering",
        "category": "재킷"
    },
    "outer_03": {
        "fit": "REGULAR_FIT",
        "colorList": ["BLACK"],
        "patternList": ["SOLID"],
        "seasonList": ["WINTER"],
        "styleList": ["CASUAL"],
        "textureList": ["NYLON"],
        "extra": "water-resistant, warm",
        "category": "점퍼"
    },
    "outer_04": {
        "fit": "PUFFER",
        "colorList": ["WHITE"],
        "patternList": ["SOLID"],
        "seasonList": ["WINTER"],
        "styleList": ["SPORTY"],
        "textureList": ["DOWN"],
        "extra": "ultra-warm, lightweight",
        "category": "패딩"
    },
    "outer_05": {
        "fit": "SLIM_FIT",
        "colorList": ["BROWN"],
        "patternList": ["SOLID"],
        "seasonList": ["SPRING", "AUTUMN"],
        "styleList": ["CASUAL"],
        "textureList": ["LEATHER"],
        "extra": "vintage style, durable",
        "category": "짚업"
    },
    "dress_01": {
        "fit": "A-LINE",
        "colorList": ["WHITE"],
        "patternList": ["LACE"],
        "seasonList": ["SPRING", "SUMMER"],
        "styleList": ["ELEGANT"],
        "textureList": ["COTTON"],
        "extra": "delicate design, breathable",
        "category": "드레스"
    },
    "dress_02": {
        "fit": "BODYCON",
        "colorList": ["RED"],
        "patternList": ["SOLID"],
        "seasonList": ["SUMMER"],
        "styleList": ["SEXY"],
        "textureList": ["SILK"],
        "extra": "sleek fit, luxury fabric",
        "category": "드레스"
    },
    "dress_03": {
        "fit": "LOOSE_FIT",
        "colorList": ["BLUE"],
        "patternList": ["DENIM"],
        "seasonList": ["AUTUMN"],
        "styleList": ["CASUAL"],
        "textureList": ["DENIM"],
        "extra": "relaxed fit, sturdy fabric",
        "category": "점프수트"
    },
    "dress_04": {
        "fit": "WRAP",
        "colorList": ["GREEN"],
        "patternList": ["FLORAL"],
        "seasonList": ["SPRING", "SUMMER"],
        "styleList": ["FEMININE"],
        "textureList": ["VISCOSE"],
        "extra": "flattering fit, soft texture",
        "category": "드레스"
    },
    "dress_05": {
        "fit": "RELAXED_FIT",
        "colorList": ["ORANGE"],
        "patternList": ["GEOMETRIC"],
        "seasonList": ["SUMMER"],
        "styleList": ["BOHO"],
        "textureList": ["LINEN"],
        "extra": "lightweight, breezy",
        "category": "점프수트"
    },
    "shoes_01": {
        "fit": "REGULAR_FIT",
        "colorList": ["WHITE"],
        "patternList": ["SOLID"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["SPORTY"],
        "textureList": ["LEATHER"],
        "extra": "comfortable, classic design",
        "category": "운동화"
    },
    "shoes_02": {
        "fit": "SLIM_FIT",
        "colorList": ["BLACK"],
        "patternList": ["SOLID"],
        "seasonList": ["SPRING", "AUTUMN"],
        "styleList": ["FORMAL"],
        "textureList": ["LEATHER"],
        "extra": "sleek design, formal wear",
        "category": "구두"
    },
    "shoes_03": {
        "fit": "RELAXED_FIT",
        "colorList": ["BROWN"],
        "patternList": ["SOLID"],
        "seasonList": ["SUMMER"],
        "styleList": ["CASUAL"],
        "textureList": ["LEATHER"],
        "extra": "easy to wear, casual style",
        "category": "샌들/슬리퍼"
    },
    "shoes_04": {
        "fit": "SNUG_FIT",
        "colorList": ["RED"],
        "patternList": ["SOLID"],
        "seasonList": ["WINTER"],
        "styleList": ["SPORTY"],
        "textureList": ["SYNTHETIC"],
        "extra": "warm and water-resistant",
        "category": "운동화"
    },
    "shoes_05": {
        "fit": "REGULAR_FIT",
        "colorList": ["BLACK"],
        "patternList": ["SOLID"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["FORMAL"],
        "textureList": ["SUEDE"],
        "extra": "elegant design, versatile",
        "category": "구두"
    },
    "accessory_01": {
        "fit": "REGULAR_FIT",
        "colorList": ["GOLD"],
        "patternList": ["SOLID"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["FORMAL"],
        "textureList": ["METAL"],
        "extra": "elegant design, timeless piece",
        "category": "주얼리"
    },
    "accessory_02": {
        "fit": "ADJUSTABLE",
        "colorList": ["BLACK"],
        "patternList": ["SOLID"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["CASUAL"],
        "textureList": ["LEATHER"],
        "extra": "versatile, everyday use",
        "category": "모자"
    },
    "accessory_03": {
        "fit": "SNUG_FIT",
        "colorList": ["BLUE"],
        "patternList": ["STRIPES"],
        "seasonList": ["WINTER"],
        "styleList": ["CASUAL"],
        "textureList": ["WOOL"],
        "extra": "warm, comfortable",
        "category": "모자"
    },
    "accessory_04": {
        "fit": "LOOSE_FIT",
        "colorList": ["PINK"],
        "patternList": ["FLORAL"],
        "seasonList": ["SPRING"],
        "styleList": ["FEMININE"],
        "textureList": ["SILK"],
        "extra": "delicate design, soft texture",
        "category": "기타"
    },
    "accessory_05": {
        "fit": "ADJUSTABLE",
        "colorList": ["WHITE"],
        "patternList": ["SOLID"],
        "seasonList": ["SUMMER"],
        "styleList": ["SPORTY"],
        "textureList": ["COTTON"],
        "extra": "breathable, sun protection",
        "category": "모자"
    },
    "bag_01": {
        "fit": "REGULAR_FIT",
        "colorList": ["BLACK"],
        "patternList": ["SOLID"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["CASUAL"],
        "textureList": ["LEATHER"],
        "extra": "durable, everyday use",
        "category": "백팩"
    },
    "bag_02": {
        "fit": "SNUG_FIT",
        "colorList": ["RED"],
        "patternList": ["SOLID"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["SPORTY"],
        "textureList": ["NYLON"],
        "extra": "lightweight, adjustable straps",
        "category": "힙색"
    },
    "bag_03": {
        "fit": "LOOSE_FIT",
        "colorList": ["BLUE"],
        "patternList": ["DENIM"],
        "seasonList": ["SUMMER"],
        "styleList": ["CASUAL"],
        "textureList": ["DENIM"],
        "extra": "trendy design, spacious",
        "category": "백팩"
    },
    "bag_04": {
        "fit": "SLIM_FIT",
        "colorList": ["BROWN"],
        "patternList": ["SOLID"],
        "seasonList": ["SPRING", "AUTUMN"],
        "styleList": ["CASUAL"],
        "textureList": ["LEATHER"],
        "extra": "vintage style, durable",
        "category": "백팩"
    },
    "bag_05": {
        "fit": "ADJUSTABLE",
        "colorList": ["GREEN"],
        "patternList": ["CAMO"],
        "seasonList": ["ALL_SEASON"],
        "styleList": ["STREET"],
        "textureList": ["CANVAS"],
        "extra": "trendy design, durable",
        "category": "힙색"
    }
}
        mock_data=[]
        for idx,e in enumerate(mock.values()):
            e["id"]=idx
            mock_data.append(Clothes(**e))

        return mock_data

    def get_recommend_outfit(self, user_id, consider:Consider):
        recommend_info:Recommend=Recommend(clothes=self.get_user_clothes(user_id), consider=consider)
        print(recommend_info.model_dump_json())
        outfitRecommendtaion =  OutfitRecommendation(recommend_info)
        print(outfitRecommendtaion.get_result())