import json
from typing import List

from fastapi import UploadFile, HTTPException

from app.core.prompt import ExtractAttribute, make_user_prompt, parse_response
from openai import OpenAI

from app.utils.image_utils import remove_background_and_encode

client = OpenAI()


class AttributeService:
    def extract_attributes(self, images: List[UploadFile], infos: List[str]) -> dict:
        user_contents = []
        success_count = 0
        for idx, image in enumerate(images):
            try:
                prepared_image = remove_background_and_encode(image)
                user_contents.extend(make_user_prompt(idx, prepared_image, infos[idx]))
                success_count += 1
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
        response = client.chat.completions.create(
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
                    "content": user_contents
                },
            ],
            temperature=1,
            max_tokens=150 * success_count,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        save_response_to_file(response.model_dump_json())
        print(response.choices[0].message.content)
        return parse_response(json.loads(response.choices[0].message.content))


def save_response_to_file(response, file_path: str = "./response.json"):
    with open(file_path, 'a') as file:
        json.dump(response, file)
        file.write('\n')
