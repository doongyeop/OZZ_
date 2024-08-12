import logging
import os

import requests

from app.core.client.clothesMetadata import ClothesMetadata, clothesMetadata
from app.core.client.outfitRecommend import OutfitRecommendation
from app.schemas.recommend import Clothes, Recommend, Consider, RecommendationsResponse
from app.utils.image_utils import make_snapshot


class RecommendService:
    clothes_metadata: ClothesMetadata = clothesMetadata

    def __init__(self):
        pass

    def get_user_clothes(self, user_id):
        # 엔드포인트 URL 및 clothesId 설정
        url = f"{os.getenv('CLOTHES_ENDPOINT')}/api/clothes/users/all"

        logging.info(f"Try load {user_id}'s clothes")

        response = requests.get(url, headers={"X-User-Id": user_id})

        logging.info(f"Loaded {user_id}'s clothes" + str(response.json()))

        clothes = []
        if response.status_code == 200:
            data = response.json()
            for idx, e in enumerate(data):
                e["subCategory"] = e["categoryLow"]["name"]
                e["parentCategory"] = clothesMetadata.lowcategoryId_to_highcategoryName(e["categoryLow"]["categoryLowId"])
                e["imgPath"] = e["imageFile"]["filePath"]
                clothes.append(Clothes(**e))
        return clothes

    def get_recommend_outfit(self, user_id, consider: Consider) -> list[RecommendationsResponse]:
        recommend_info: Recommend = Recommend(clothes=self.get_user_clothes(user_id), consider=consider)
        id_2_clothes: dict[int, Clothes] = {clothes.id: clothes for clothes in recommend_info.clothes}
        logging.info("코디 추천 요청 : "+str(recommend_info))
        outfitRecommendtaion = OutfitRecommendation(recommend_info)
        recommendation_result=outfitRecommendtaion.get_result()
        logging.info("코디 추천 결과 : "+str(recommendation_result))
        return_outfit: list[RecommendationsResponse] = []
        for outfit in recommendation_result:
            validated_data = self.validate_outfit(outfit.items, id_2_clothes)
            if validated_data:
                return_outfit.append(RecommendationsResponse(title=outfit.title, items=outfit.items, style=outfit.style,
                                                             img=make_snapshot(validated_data)))
            else:
                logging.info("복장 불량 : "+str(outfit))
        return return_outfit

    def validate_outfit(self, items: list[int], id_2_clothes: dict[int, Clothes]):
        outfit_set = []
        for item in items:
            clothes = id_2_clothes[item]
            high_category = self.clothes_metadata.lowcategoryId_to_highcategoryId(clothes.subCategory)
            if high_category is not None and high_category not in outfit_set:
                outfit_set.append((clothes.id, high_category, clothes.imgPath))
        if len(outfit_set) == len(items):
            return outfit_set
        else:
            return None
