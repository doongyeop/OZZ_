﻿import json
import logging

from app.core.client.openAIClient import OpenAIClient

from app.schemas.attributes import GPTAttrResponse, Attributes


class ValidateProperty(OpenAIClient):
    system_prompt: str = """
You are the manager who validates and modifies the value of each property.
Check if the value of each property exists in <possible values>.
If there is an incorrect value that does not exist in <possible values>, modify the incorrect value to the most similar value among <possible values>.

Request format:
{<integer id>:<properties you need to validate>}
Response format should also be the same JSON:
{<integer id>:<properties you validated and modified>}
"""
    invalid_data: dict[int, Attributes]

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
                            "text": ValidateProperty.system_prompt
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
        return json.loads(response.choices[0].message.content)

    def validate_data(self, raw_attributes: Attributes):
        validations = [
            self.clothes_metadata.fit.validate(raw_attributes.fit),
            self.clothes_metadata.color.validate(raw_attributes.colorList),
            self.clothes_metadata.pattern.validate(raw_attributes.patternList),
            self.clothes_metadata.season.validate(raw_attributes.seasonList),
            self.clothes_metadata.style.validate(raw_attributes.styleList),
            self.clothes_metadata.texture.validate(raw_attributes.textureList)
        ]
        if False in validations:
            return False
        return True

    def make_user_content(self):
        user_content = {k: v.model_dump(exclude={"extra", "categoryLowId"}) for k, v in self.invalid_data.items()}

        return [{
            "type": "text",
            "text": json.dumps(user_content)
        }]

    def make_assistant_content(self):
        assistant_content = ""
        assistant_content += f"""
1.<fit>{'' if self.clothes_metadata.fit.is_essential else '`null` value possible'}
<possibleValues>{self.clothes_metadata.fit.get_values()}</possibleValues>
</fit>
"""
        assistant_content += f"""
2.<colorList>{'' if self.clothes_metadata.color.is_essential else '`null` value possible'}
<possibleValues>{self.clothes_metadata.color.get_values()}</possibleValues>
</colorList>
"""
        assistant_content += f"""
3.<patternList>{'' if self.clothes_metadata.pattern.is_essential else '`null` value possible'}
<possibleValues>{self.clothes_metadata.pattern.get_values()}</possibleValues>
</patternList>
"""
        assistant_content += f"""
4.<seasonList>{'' if self.clothes_metadata.season.is_essential else '`null` value possible'}
<possibleValues>{self.clothes_metadata.season.get_values()}</possibleValues>
</seasonList>
"""
        assistant_content += f"""
5.<styleList>{'' if self.clothes_metadata.style.is_essential else '`null` value possible'}
<possibleValues>{self.clothes_metadata.style.get_values()}</possibleValues>
</styleList>
"""
        assistant_content += f"""
6.<textureList>{'' if self.clothes_metadata.texture.is_essential else '`null` value possible'}
<possibleValues>{self.clothes_metadata.texture.get_values()}</possibleValues>
</textureList>
"""
        return [
            {
                "type": "text",
                "text": assistant_content
            }
        ]

    def process(self, raw_data: dict[int, Attributes]):
        self.invalid_data = {}

        for k, datum in raw_data.items():
            if not self.validate_data(datum):
                self.invalid_data[k] = datum
        valid_data = self.get_response()
        for k, datum in valid_data.items():
            if isinstance(k, str):
                k=int(k)
            raw_data[k]=raw_data[k].model_copy(update={**datum}, deep=True)
            if not self.validate_data(raw_data[k]):
                del raw_data[k]
                logging.error(f"id : {k} 속성 검증 및 정규화 실패")
        return raw_data


class ValidateCategory(OpenAIClient):
    system_prompt: str = """
I'll give you the parent category and its subcategories that are already defined.
Change them to subcategories that have similar values and shapes or usage. Change it to the most similar subcategory within the same parent category

I'll give you the value in the format {`parent category`:[`incorrect value list`]}, like {"가방":["크로스백","핸드백"]}

Give me the response in JSON format {`parent category`:{`Incorrect value`:`Correctly matched subcategory`}}, like {"가방":{"크로스백":"힙색","핸드백":"가방"}}
"""
    invalid_subcategories: dict[str, list[str]]

    def get_response(self) -> dict[str, dict[str, str]]:
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": ValidateCategory.system_prompt
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
            presence_penalty=0,
        )
        return json.loads(response.choices[0].message.content)

    def make_assistant_content(self):
        assistant_content = []
        for k, v in self.clothes_metadata.category_dict().items():
            assistant_content.append({
                "parent": k,
                "subcategories": v
            })
        return [{
            "type": "text",
            "text": json.dumps(assistant_content,ensure_ascii=False),
        }]

    def make_user_content(self):
        return [{
            "type": "text",
            "text": json.dumps(self.invalid_subcategories, ensure_ascii=False),
        }]

    def validate_data(self, raw_GPTAttrResponse: GPTAttrResponse):
        if raw_GPTAttrResponse.parentCategory in self.clothes_metadata.category_dict():
            if raw_GPTAttrResponse.subCategory in self.clothes_metadata.low_category_2_code():
                return True
            else:
                return False
        else:
            raise Exception("존재하지 않는 상위 카테고리 :" + raw_GPTAttrResponse.parentCategory)

    def process(self, raw_data: dict[int, GPTAttrResponse]) -> dict[int, Attributes]:
        self.invalid_subcategories = {}
        invalid_data: GPTAttrResponse = []

        for key, datum in raw_data.items():
            if not self.validate_data(datum):
                invalid_data.append(datum)
                if datum.parentCategory not in self.invalid_subcategories:
                    self.invalid_subcategories[datum.parentCategory] = []
                if datum.subCategory not in self.invalid_subcategories[datum.parentCategory]:
                    self.invalid_subcategories[datum.parentCategory].append(datum.subCategory)
        is_clear=True

        if len(self.invalid_subcategories) != 0:
            is_clear=False
            valid_subcategories = self.get_response()

            for datum in invalid_data:
                old_subcategory=datum.subCategory
                datum.subCategory = valid_subcategories[datum.parentCategory][datum.subCategory]
                logging.info(f"id : 기존 카테고리 : {old_subcategory} -> 새로운 카테고리 : {datum.subCategory}")

        valid_data = {}
        for key, datum in raw_data.items():
            if not is_clear and not self.validate_data(datum):
                logging.error(f"id : {key} 카테고리 검증 및 정규화 실패 서브 카테고리 : {datum.subCategory}")
            else:
                valid_data[key] = Attributes(
                    **datum.model_dump(exclude={"parentCategory", "subCategory"}),
                    categoryLowId=self.clothes_metadata.low_category_2_code()[datum.subCategory]
                )
        return valid_data


validateCategory = ValidateCategory()
validateProperty = ValidateProperty()


def run_validate(raw_data: dict[int, GPTAttrResponse]):
    init_keys = list(raw_data.keys())
    category_validated_data = validateCategory.process(raw_data)
    valid_data = validateProperty.process(category_validated_data)
    valid_keys = list(valid_data.keys())
    removed_data = []
    for key in init_keys:
        if key not in valid_keys:
            removed_data.append(str(key))
    if removed_data:
        logging.info(f"key : {', '.join(removed_data)}| 속성 검증 필터링 됨")
    logging.info(f"key : {', '.join(map(str, valid_keys))}| 최종 속성 검증")

    return valid_data
