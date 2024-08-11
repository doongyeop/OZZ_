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
        url = f"{os.getenv('CLOTHES_ENDPOINT')}"

        logging.info(f"Try load {user_id}'s clothes")

        # patch 요청 보내기
        response = requests.get(url, headers={"X-User-Id": user_id})

        logging.info(f"Loaded {user_id}'s clothes"+str(response.json()))

        clothes=[]
        if response.status_code==200:
            data = response.json()
            for idx, e in enumerate(data):
                e["category"] = e["categoryLow"]["name"]
                clothes.append(Clothes(**e))
        return clothes

    def get_recommend_outfit(self, user_id, consider:Consider):
        recommend_info:Recommend=Recommend(clothes=self.get_user_clothes(user_id), consider=consider)
        print(recommend_info.model_dump_json())
        outfitRecommendtaion =  OutfitRecommendation(recommend_info)
        print(outfitRecommendtaion.get_result())

    def make_snapshot(self):
        #TODO 코디 스냅샷 만들기
        return "IMAGE"
