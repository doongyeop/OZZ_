from typing import Any


class ExtractAttribute:
    system_prompt = """
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


def make_user_prompt(idx: int, image: str, info: str):
    return {
        "type": "image_url",
        "image_url": {
            "url": f"data:image/jpeg;base64,{image}"
        }
    }, {
        "type": "text",
        "text": f"<clothes><order>{idx}</order><info>{info}</info></clothes>"
    }


# 문자열을 분리하여 배열로 변환하는 함수
def transform(key, item):
    if "List" in key:
        return item.split(', ')
    elif "category" == key:
        return item.split('>')[-1]
    else:
        return item


def parse_response(response: dict) -> list[dict[Any, Any]]:
    transformed_data = []
    for i in range(len(response)):
        value = response[str(i)]
        transformed_item = {k: transform(k, v) for k, v in value.items()}
        transformed_data.append(transformed_item)
    return transformed_data
