import json
import logging
from typing import Any

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
1. fit: Type to how clothes fit body. Single value. `None` if there is no possible matching value.
<possibleValues>OVER_FIT, SEMI_OVER_FIT, REGULAR_FIT, SLIM_FIT</possibleValues>
2. colorList: Identify up to 3 primary colors, Multiple values. It must match with possible values.
<possibleValues>WHITE, BLACK, GRAY, RED, PINK, ORANGE, BEIGE, YELLOW, BROWN, GREEN, KHAKI, MINT, BLUE, NAVY, SKY, PURPLE, LAVENDER, WINE, NEON, GOLD</possibleValues>
3. patternList: Multiple values. `None` if there is no possible matching value.
<possibleValues>SOLID, STRIPED, ZIGZAG, LEOPARD, ZEBRA, ARGYLE, DOT, PAISLEY, CAMOUFLAGE, FLORAL, LETTERING, GRAPHIC, SKULL, TIE_DYE, GINGHAM, GRADATION, CHECK, HOUNDSTOOTH.</possibleValues>
4. seasonList: Suitable season to wear. Multiple values. `None` if there is no possible matching value.
<possibleValues>SPRING, SUMMER, AUTUMN, WINTER.</possibleValues>
5. styleList: Unique appearance or atmosphere. Multiple values. `None` if there is no possible matching value.
<possibleValues>ROMANTIC, STREET, SPORTY, NATURAL, MANNISH, CASUAL, ELEGANT, MODERN, FORMAL, ETHNIC</possibleValues>
6. textureList: Multiple values. `None` if there is no possible matching value.
<possibleValues>FUR, KNIT, MOUTON, LACE, SUEDE, LINEN, ANGORA, MESH, CORDUROY, FLEECE, SEQUIN_GLITTER, NEOPRENE, DENIM, SILK, JERSEY, SPANDEX, TWEED, JACQUARD, VELVET, LEATHER, VINYL_PVC, COTTON, WOOL_CASHMERE, CHIFFON, SYNTHETIC_POLYESTER.</possibleValues>
7. extra: Please list in detail in words the attributes of clothing items that cannot be expressed using criteria 1-6.
8. category: Please categorize into subcategories. It must match with possible values. Possible values are expressed as <parent category>subcategories</parent category>.
<possibleValues>
<상의>탑, 블라우스, 티셔츠, 니트웨어, 셔츠, 브라탑, 후드티</상의>
<하의>: 청바지, 팬츠, 스커트, 레깅스, 조거팬츠</하의>
<아우터>코트, 재킷, 점퍼, 패딩, 베스트, 가디건, 짚업</아우터>
<원피스>드레스, 점프수트</원피스>
<신발>운동화, 구두, 샌들</신발>
<악세서리>주얼리, 기타, 모자</악세서리>
<가방>가방, 백팩, 힙색</가방>
<possibleValues>

rule:
<clothes><order></order><info></info></clothes>
The values wrapped in <order> are the order of the clothing photos.
The information wrapped in <info> is an attribute that has already been identified for each garment. If the identified information is given, please refer to it.

Response Format:
Please return it in JSON format as in the following example.
{
<order> value :{"fit" : "OVER_FIT","colorList" : "BLACK, YELLOW","patternList" : "STRIPED","seasonList" : "SPRING, SUMMER, AUTUMN","styleList" : "CASUAL, SPORTY","textureList" : "MESH","extra" : "sleeveless, cropped","category" : "상의>티셔츠"}
}
"""

    # 문자열을 분리하여 배열로 변환하는 함수
    def transform(self, key, item):
        category2code = {"탑": 1,
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
                         "샌들": 24,
                         "주얼리": 25,
                         "기타": 26,
                         "모자": 27,
                         "가방":28,
                         "백팩": 29,
                         "힙색": 30,
                         "악세서리":26}
        if item == "None":
            return None
        if "List" in key:
            if "color" in key:
                valid_color=[]
                for color in item.split(', '):
                    if color in ["WHITE", "BLACK", "GRAY", "RED", "PINK", "ORANGE", "BEIGE", "YELLOW", "BROWN", "GREEN", "KHAKI", "MINT", "BLUE", "NAVY", "SKY", "PURPLE", "LAVENDER", "WINE", "NEON", "GOLD"]:
                        valid_color.append(color)
                if valid_color:
                    return valid_color
                else:
                    return ["WHITE"]
            else:
                return item.split(',')
        elif "category" == key:
            return category2code[item.split('>')[-1]]
        else:
            return item

    def parse_response(self, response: dict) -> dict[int, Attributes]:
        transformed_data = {}
        last_id=0
        for id in response.keys():
            value = response[id]
            transformed_item = {k: self.transform(k, v) for k, v in value.items()}
            transformed_item["categoryLowId"] = transformed_item["category"]
            del transformed_item["category"]

            logging.info("Attribute extracted -> " + str(transformed_data))

            transformed_data[int(id)] = Attributes(**transformed_item)
            last_id=int(id)
        logging.info("id: "+str(last_id)+" attribute extracted -> "+str(transformed_data[last_id]))
        return transformed_data

    def get_response(self) -> dict[Any, Any]:
        user_content: list = self.make_user_content()
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
            temperature=0,
            max_tokens=75 * len(user_content),
            top_p=0.9,
            frequency_penalty=0,
            presence_penalty=0
        )

        return json.loads(response.choices[0].message.content)

    def get_result(self):
        pass

    def make_user_content(self):
        pass


class ExtractAttributesURL(ExtractAttribute):
    dataList: list

    def __init__(self, data: list[NormalizedClothes]):
        self.dataList = data

    def make_user_content(self) -> list:
        content_list = []
        for data in self.dataList:
            content_list.extend([{
                "type": "image_url",
                "image_url": {
                    "url": f"{data.imgUrl}"
                }
            }, {
                "type": "text",
                "text": f"<clothes><order>{data.clothId}</order><info>{data.category + (',' + data.color if data.color else '')}</info></clothes>"
            }])
        return content_list

    def get_result(self):
        return self.parse_response(self.get_response())


class ExtractAttributesImage(ExtractAttribute):
    image: UploadFile

    def __init__(self, image: UploadFile):
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
