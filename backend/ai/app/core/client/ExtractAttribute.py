import json
from typing import Any, Dict

from dotenv import load_dotenv
from fastapi import UploadFile
from openai import OpenAI

from app.schemas.attributes import NormalizedClothes, Attributes
from app.utils.image_utils import remove_background_and_encode

load_dotenv()
client = OpenAI()

class ExtractAttribute:
    client = client
    system_prompt: str = """
your role:
You are an AI expert in clothing analysis. Analyze photos of clothing items and identify them based on the following attributes.
Identify only the attributes of a single representative garment shown in each photo.

attributes:
1. fit: Type to how clothes fit body. Single value.
- Possible values: OVER_FIT, SEMI_OVER_FIT, REGULAR_FIT, SLIM_FIT.
2. colorList: Identify up to 3 primary colors, Multiple values.
- possible values: WHITE, BLACK, GRAY, RED, PINK, ORANGE, BEIGE, YELLOW, BROWN, GREEN, KHAKI, MINT, BLUE, NAVY, SKY, PURPLE, LAVENDER, WINE, NEON, GOLD.
3. patternList: Multiple values.
- possible values: SOLID, STRIPED, ZIGZAG, LEOPARD, ZEBRA, ARGYLE, DOT, PAISLEY, CAMOUFLAGE, FLORAL, LETTERING, GRAPHIC, SKULL, TIE_DYE, GINGHAM, GRADATION, CHECK, HOUNDSTOOTH.
4. seasonList: Suitable season to wear. Multiple values.
- possible values: SPRING, SUMMER, AUTUMN, WINTER.
5. styleList: Unique appearance or atmosphere. Multiple values
- possible values: CASUAL, CLASSIC, MANNISH, FEMININE, HIPPIE, MODERN, COUNTRY, GENDERLESS, SPORTY, RETRO, MILITARY, PREPPY, TOMBOY, ROMANTIC, WESTERN, SOPHISTICATED, COTTAGER, RESORT, KITSCH, KIDULT, STREET, SEXY, ORIENTAL, AVANT_GARDE, HIPHOP, PUNK.
6. textureList: Multiple values.
- possible values: FUR, KNIT, MOUTON, LACE, SUEDE, LINEN, ANGORA, MESH, CORDUROY, FLEECE, SEQUIN_GLITTER, NEOPRENE, DENIM, SILK, JERSEY, SPANDEX, TWEED, JACQUARD, VELVET, LEATHER, VINYL_PVC, COTTON, WOOL_CASHMERE, CHIFFON, SYNTHETIC_POLYESTER.
7. extra: Please list in words the attributes of clothing items that cannot be expressed by criteria 1-6.
8. category: Please categorize into subcategories.
- Possible values:
    - 상의: 탑, 블라우스, 티셔츠, 니트웨어, 셔츠, 브라탑, 후드티, 맨투맨 
    - 하의: 청바지, 팬츠, 스커트, 레깅스, 조거팬츠
    - 아우터: 코트, 재킷, 점퍼, 패딩, 베스트, 가디건, 짚업
    - 원피스: 드레스, 점프수트
    - 신발: 운동화, 구두, 샌들/슬리퍼
    - 악세서리: 주얼리, 기타, 모자
    - 가방: 백팩, 힙색

rule:
<clothes><order></order><info></info></clothes>
The values wrapped in <order> are the order of the clothing photos.
The information contained in <info> are attributes that have already been identified for each garment. Please apply it over the photo analysis content.

Response Format:
Please return it in JSON format as in the following example.
"None" if there is no corresponding attribute value.
{
<order> value :{"fit" : "OVER_FIT","colorList" : "BLACK, YELLOW","patternList" : "STRIPED","seasonList" : "SPRING, SUMMER, AUTUMN","styleList" : "CASUAL, SPORTY","textureList" : "MESH","extra" : "sleeveless, cropped","category" : "상의>티셔츠"}
}
"""

    # 문자열을 분리하여 배열로 변환하는 함수
    def transform(self, key, item):
        category2code={ "탑": 1,
                        "블라우스": 2,
                        "티셔츠": 3,
                        "니트웨어": 4,
                        "셔츠": 5,
                        "브라탑": 6,
                        "후드티": 7,
                        "청바지": 8,
                        "팬츠": 9,
                        "스커트": 10,
                        "레깅스": 11,
                        "조거팬츠": 12,
                        "코트": 13,
                        "재킷": 14,
                        "점퍼": 15,
                        "패딩": 16,
                        "베스트": 17,
                        "가디건": 18,
                        "짚업": 19,
                        "드레스": 20,
                        "점프수트": 21,
                        "운동화": 22,
                        "구두": 23,
                        "샌들/슬리퍼": 24,
                        "주얼리": 25,
                        "기타": 26,
                        "모자": 27,
                        "백팩": 28,
                        "힙색": 29}
        if "List" in key:
            return item.split(', ')
        elif "category" == key:
            return category2code[item.split('>')[-1]]
        else:
            return item


    def parse_response(self, response: dict) -> dict[int, dict[Any, Any]]:
        transformed_data = {}
        for id in response.keys():
            value = response[id]
            transformed_item = {k: self.transform(k, v) for k, v in value.items()}
            transformed_item["categoryLowId"]=transformed_item["category"]
            del transformed_item["category"]
            print(transformed_item)
            transformed_data[int(id)] = Attributes(**transformed_item)

        return transformed_data

    def get_response(self) -> dict[Any, Any]:
        user_content:list = self.make_user_content()
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": ExtractAttribute.system_prompt
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": user_content
                },
            ],
            temperature=1,
            max_tokens=75 * len(user_content),
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        return json.loads(response.choices[0].message.content)

    def get_result(self):
        pass

    def make_user_content(self):
        pass

class ExtractAttributesURL(ExtractAttribute):
    dataList:list

    def __init__(self, data:list[NormalizedClothes]):
        self.dataList = data

    def make_user_content(self) -> list:
        content_list=[]
        for data in self.dataList:
            content_list.extend([{
                "type": "image_url",
                "image_url": {
                    "url": f"{data.imgUrl}"
                }
            }, {
                "type": "text",
                "text": f"<clothes><order>{data.clothId}</order><info>{data.category+("," + data.color if data.color else "")}</info></clothes>"
            }])
        return content_list

    def get_result(self):
        return self.parse_response(self.get_response())

class ExtractAttributesImage(ExtractAttribute):
    image:UploadFile

    def __init__(self, image:UploadFile):
        self.image = image

    def make_user_content(self) -> list:
        return [{
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{remove_background_and_encode(self.image)}"
            }
        }, {
            "type": "text",
            "text": f"<clothes><order>{0}</order><info></info></clothes>"
        }]

    def get_result(self):
        return self.parse_response(self.get_response())[0]