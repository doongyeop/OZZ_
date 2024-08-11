import json

from app.core.client.openAIClient import OpenAIClient


class ValidateAttribute(OpenAIClient):
    system_prompt: str = """
You are a validator who verifies the values of each attribute.
Check if the values of each attribute are values that exist in <possible values>.
If there is an incorrect value that does not exist in <possible values>, correct the incorrect value to the closest value among <possible values>.

I will give you data in JSON format.
Respond to me with the same data in JSON format.
"""
    def __init__(self,data):
        super().__init__()
        self.data=data

    def get_response(self) :
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
                            "text": ValidateAttribute.system_prompt
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": self.make_assistant_content()
                },
                {
                    "role": "user",
                    "content": self.make_user_content()
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
        return json.dumps(self.get_response())

    def make_user_content(self):
        return [{
                "type": "text",
                "text": json.dumps(self.data),
            }]

    def make_assistant_content(self):
        return [
            {
                "type": "text",
                "text": """
Attributes:
1. <fit>
<Constraint>Type to how clothes fit body. Single value. `None` if there is no possible matching value.</Constraint>
<possibleValues>OVER_FIT, SEMI_OVER_FIT, REGULAR_FIT, SLIM_FIT</possibleValues>
</fit>
2. <colorList>
<Constraint>Identify up to 3 primary colors, Multiple values. Essential value</Constraint>
<possibleValues>WHITE, BLACK, GRAY, RED, PINK, ORANGE, BEIGE, YELLOW, BROWN, GREEN, KHAKI, MINT, BLUE, NAVY, SKY, PURPLE, LAVENDER, WINE, NEON, GOLD</possibleValues>
</colorList>
3. <patternList>
<Constraint>Multiple values. `None` if there is no possible matching value</Constraint>
<possibleValues>SOLID, STRIPED, ZIGZAG, LEOPARD, ZEBRA, ARGYLE, DOT, PAISLEY, CAMOUFLAGE, FLORAL, LETTERING, GRAPHIC, SKULL, TIE_DYE, GINGHAM, GRADATION, CHECK, HOUNDSTOOTH</possibleValues>
</patternList>
4. <seasonList>
<Constraint>Suitable season to wear. Multiple values. `None` if there is no possible matching value</Constraint>
<possibleValues>SPRING, SUMMER, AUTUMN, WINTER</possibleValues>
</seasonList>
5. <styleList>
<Constraint>Unique appearance or atmosphere. Multiple values. `None` if there is no possible matching value</Constraint>
<possibleValues>ROMANTIC, STREET, SPORTY, NATURAL, MANNISH, CASUAL, ELEGANT, MODERN, FORMAL, ETHNIC</possibleValues>
</styleList>
6. <textureList>
<Constraint>Multiple values. `None` if there is no possible matching value</Constraint>
<possibleValues>FUR, KNIT, MOUTON, LACE, SUEDE, LINEN, ANGORA, MESH, CORDUROY, FLEECE, SEQUIN_GLITTER, NEOPRENE, DENIM, SILK, JERSEY, SPANDEX, TWEED, JACQUARD, VELVET, LEATHER, VINYL_PVC, COTTON, WOOL_CASHMERE, CHIFFON, SYNTHETIC_POLYESTER</possibleValues>
</textureList>
7. <category>
<Constraint>Please categorize into subcategories. Essential value. Possible values are expressed as <parent category>subcategories</parent category></Constraint>
<possibleValues>
<상의>탑, 블라우스, 티셔츠, 니트웨어, 셔츠, 브라탑, 후드티</상의>
<하의>: 청바지, 팬츠, 스커트, 레깅스, 조거팬츠</하의>
<아우터>코트, 재킷, 점퍼, 패딩, 베스트, 가디건, 짚업</아우터>
<원피스>드레스, 점프수트</원피스>
<신발>운동화, 구두, 샌들</신발>
<악세서리>주얼리, 기타, 모자</악세서리>
<가방>가방, 백팩, 힙색</가방>
</possibleValues>
</category>
"""
            }
        ]
