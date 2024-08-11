import json

from app.core.client.openAIClient import OpenAIClient
from app.schemas.recommend import Recommend, RecommendedOutfit

class OutfitRecommendation(OpenAIClient):
    recommend:Recommend
    system_prompt = """
Role:
You are a professional AI that recommends outfits based on the clothes in your closet.
It provides recommendations through a comprehensive analysis of the current weather and the characteristics of the clothes.

Things to consider:
- Clothing features: <cloth_id> is the id of the corresponding clothing
- weather: Weather and average temperature
- pointColor: The point color of the clothing that must be included
- essential: Clothing that must be included
- style: Clothing styles that would like to recommend

Request example :
{
    "clothes":[{
            "id": <clothe_id>
            "fit": "REGULAR_FIT",
            "colorList": ["GREEN"],
            "patternList": ["LETTERING"],
            "seasonList": ["SPRING","AUTUMN"],
            "styleList": ["CASUAL"],
            "textureList": ["COTTON"],
            "extra": "customizable design, sweatshirt",
            "category": "맨투맨"
        }]
    },
    "consider":{
        "weather":{"temperature":25,"weather": "rain"}
        "pointColor":["RED","WHITE"],
        "essential":[<clothe_id>],
        "style":"FORMAL"
    }
}

Result:
Before reporting the result, check if the clothes are properly composed.
Report the recommended clothes in JSON format, including a brief title, the ids of the composed clothes, and <recommendation_reason> for the recommendation.
Please choose the style of the recommended outfit from the <possibleValues>.
<possibleValues>ROMANTIC, STREET, SPORTY, NATURAL, MANNISH, CASUAL, ELEGANT, MODERN, FORMAL, ETHNIC</possibleValues>
Recommend up to 3 outfits, and if you cannot make an outfit that meets the conditions, please write a reason why you cannot make it in "result".


Result example:
{
"result":"success"
"outfit":[{
        "title": "가을 캐주얼 룩",
        "items": ["12","54","23","56","2352"],
        "style": "FORMAL",
        "recommendation_reason": <recommendation_reason>
    }]
}
"""
    def __init__(self, recomend:Recommend):
        self.recommend = recomend

    def get_response(self):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
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
            max_tokens=75 * len(self.recommend.clothes),
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        return json.loads(response.choices[0].message.content)

    def parse_response(self, response:dict):
        print(response)
        if response["result"]=="success":
            return list(map(lambda a:RecommendedOutfit(**a),response["outfit"]))
        else:
            return []

    def get_result(self):
        return self.parse_response(self.get_response())

    def make_user_content(self):
        return [
            {
                "type": "text",
                "text": self.recommend.model_dump_json()
            }
        ]