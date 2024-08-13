import json

from app.core.client.openAIClient import OpenAIClient
from app.schemas.recommend import Recommend, RecommendedOutfit


class OutfitRecommendation(OpenAIClient):
    recommend: Recommend
    system_prompt = """
Role:
You are a professional AI that recommends outfit based on the clothes in my closet.
It provides recommendations by comprehensively analyzing the current weather and the characteristics of the clothes.

Considerations:
- Clothing characteristics: <cloth_id> is the id of the corresponding clothes.
- weather: weather and average temperature
- pointColor: point color of the clothes that should be included
- essential: clothes that should be included
- style: desired outfit styles
- category: <parentCategory> of items that make up the clothes should not overlap. In other words, the outfit do not select two clothes within the same <parentCategory>.

Example request:
{
"clothes":{
<parentCategory>:[{
"id": <clothe_id>,
<AttributeName>: <AttributeValues>,
"subCategory": "Shirts"}]
}
},
"consider":{
"weather":{"temperature":25,"weather": "rain"}
"pointColor":["RED","WHITE"],
"essential":[<clothe_id>],
"style": ["FORMAL","CASUAL"]
}
}

Result:
Reports recommended outfit in JSON format, including a simple title, the ID of the composed clothing, and a <recommendation_reason> for the recommendation. <possibleValues>Categorize the style of the recommended clothing
<possibleValues>Romantic, Street, Sporty, Natural, Masculine, Casual, Elegant, Modern, Formal, Ethnic</possibleValues>
Recommend up to 10 outfit, and if you can't make a outfit that meets the criteria, write the reason why you can't make it in "result".

Example result:
{
"result":"success"
"outfit":[{
"title": "Fall Casual Look",
"items": ["12","54","23","56","2352"],
"style": "FORMAL",
"recommendation_reason": <recommendation_reason>}]
}
"""

    def __init__(self, recommend: Recommend):
        super().__init__()
        self.recommend = recommend

    def get_response(self):
        response = self.client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": self.system_prompt
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": self.make_user_content()
                },
            ],
            temperature=1,
            max_tokens=4000,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        return json.loads(response.choices[0].message.content)

    def parse_response(self, response: dict):
        if response["result"] == "success":
            return list(map(lambda a: RecommendedOutfit(**a), response["outfit"]))
        else:
            return []

    def get_result(self):
        return self.parse_response(self.get_response())

    def make_user_content(self):
        data_format = {key: [] for key in self.clothes_metadata.category_dict().keys()}
        clothes = self.recommend.clothes
        for clothe in clothes:
            data_format[clothe.parentCategory].append(clothe.model_dump(exclude={"imgPath", "parentCategory"}))
        content = {
            "clothes": data_format,
            "consider": self.recommend.consider.model_dump()
        }
        return [
            {
                "type": "text",
                "text": json.dumps(content)
            }
        ]
