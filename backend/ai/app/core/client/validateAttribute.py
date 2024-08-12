import json
import logging

from app.core.client.openAIClient import OpenAIClient
import traceback

class ValidateAttribute(OpenAIClient):
    data:dict[int,dict[str,str]]
    system_prompt: str = """
You are a validator who verifies the values of each attribute.
Check if the values of each attribute are values that exist in <possible values>.
If there is an incorrect value that does not exist in <possible values>, correct the incorrect value to the closest value among <possible values>.

I will give you data in JSON format.
Respond to me with the same data in JSON format.
"""
    def __init__(self,data:dict[int,dict[str,str]]):
        super().__init__()
        self.data=data

    def get_response(self) :
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
            max_tokens=100 * 20,
            top_p=0.9,
            frequency_penalty=0,
            presence_penalty=0
        )
        print(response.choices[0].message.content)

        return json.loads(response.choices[0].message.content)

    def get_result(self):
        processed_data=self.get_response()
        validated_data={}
        for k, v in processed_data.items():
            try:
                self.validate(v)
                validated_data[k]=v
            except Exception as e:
                logging.error(f"id: {k} 검증 오류 {str(e)}")
                print(traceback.format_exc())
        return processed_data

    def validate(self, processed_data:dict[str,str]):
        transformed_item = {k: self.transform(k, v) for k, v in processed_data.items()}
        assert self.clothes_metadata.fit.validate(transformed_item["fit"])
        assert self.clothes_metadata.color.validate(transformed_item["colorList"])
        assert self.clothes_metadata.pattern.validate(transformed_item["patternList"])
        assert self.clothes_metadata.season.validate(transformed_item["seasonList"])
        assert self.clothes_metadata.style.validate(transformed_item["styleList"])
        assert self.clothes_metadata.texture.validate(transformed_item["textureList"])
        assert transformed_item["category"] in self.clothes_metadata.low_category_2_code()

    # 문자열을 분리하여 배열로 변환하는 함수
    def transform(self, key, item):
        if item == "None":
            return None
        if "List" in key:
            if isinstance(item, list):
                return item
            return item.split(',')
        else:
            return item

    def make_user_content(self):
        return [{
                "type": "text",
                "text": json.dumps(self.data),
            }]

    def make_assistant_content(self):
        assistant_content = ""
        assistant_content+=f"""
1.<fit>
<Constraint>{self.clothes_metadata.fit.get_constraint()}</Constraint>
<possibleValues>{self.clothes_metadata.fit.get_values()}</possibleValues>
</fit>
        """
        assistant_content+=f"""
2.<colorList>
<Constraint>{self.clothes_metadata.color.get_constraint()}</Constraint>
<possibleValues>{self.clothes_metadata.color.get_values()}</possibleValues>
</colorList>
        """
        assistant_content+=f"""
3.<patternList>
<Constraint>{self.clothes_metadata.pattern.get_constraint()}</Constraint>
<possibleValues>{self.clothes_metadata.pattern.get_values()}</possibleValues>
</patternList>
        """
        assistant_content+=f"""
4.<seasonList>
<Constraint>{self.clothes_metadata.season.get_constraint()}</Constraint>
<possibleValues>{self.clothes_metadata.season.get_values()}</possibleValues>
</seasonList>
        """
        assistant_content+=f"""
5.<styleList>
<Constraint>{self.clothes_metadata.style.get_constraint()}</Constraint>
<possibleValues>{self.clothes_metadata.style.get_values()}</possibleValues>
</styleList>
        """
        assistant_content+=f"""
6.<textureList>
<Constraint>{self.clothes_metadata.texture.get_constraint()}</Constraint>
<possibleValues>{self.clothes_metadata.texture.get_values()}</possibleValues>
</textureList>
        """
        category_possible_values=""
        for high_category, low_category_list in self.clothes_metadata.category_dict().items():
            category_possible_values+=f"<{high_category}>{', '.join(low_category_list)}</{high_category}>\n>"
        assistant_content+=f"""
7.<category>
<Constraint>Please categorize into subcategories. Possible values are expressed as <parent category>subcategories</parent category></Constraint>
{category_possible_values}
</category>
        """
        return [
            {
                "type": "text",
                "text": assistant_content
            }
        ]
