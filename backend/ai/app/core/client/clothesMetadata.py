import os

import requests
from pydantic import BaseModel
import logging

class LowCategory(BaseModel):
    categoryLowId: int
    name: str


class HighCategory(BaseModel):
    categoryHighId: int
    name: str
    categoryLowList: list[LowCategory]


class Property(BaseModel):
    code: str
    name: str


class Properties:
    name: str
    properties: list[Property]
    is_multiple: bool
    is_essential: bool
    description: str
    null_value: str = "None"

    def __init__(self, name, properties, is_multiple, is_essential, description):
        super().__init__()
        self.name = name
        self.properties = properties
        self.is_multiple = is_multiple
        self.is_essential = is_essential
        self.description = description

    def get_constraint(self):
        constraint_text = self.description
        if self.is_multiple:
            constraint_text += "Multiple values. "
        else:
            constraint_text += "Single value."
        if self.is_essential:
            constraint_text += "Essential values. "
        else:
            constraint_text += f"`{Properties.null_value}` if there is no possible matching value"
        return constraint_text

    def get_values(self):
        return ", ".join(self.properties)

class ClothesMetadata:
    categories: list[HighCategory]
    attributes: list[str]
    fit: Properties
    season: Properties
    size: Properties
    style: Properties
    texture: Properties
    color: Properties
    pattern: Properties

    def __init__(self):
        response = requests.get(f"{os.getenv('CLOTHES_ENDPOINT')}/api/categories")
        if response.ok:
            self.categories = response.json()
        else:
            logging.error(f"{response.request.url} 카테고리 불러오기 실패, {str(response.json())}")
            raise ConnectionError
        response = requests.get(f"{os.getenv('CLOTHES_ENDPOINT')}/api/clothes/properties/all")
        if response.ok:
            self.attributes = response.json()
            attr_dict_data = self.attr_dict()
            self.fit = Properties("FIT", attr_dict_data["FIT"], False, False, "Type to how clothes fit body.")
            self.season = Properties("SEASON", attr_dict_data["SEASON"], True, False, "Suitable season to wear.")
            self.size = Properties("SIZE", attr_dict_data["SIZE"], False, False, "")
            self.style = Properties("STYLE", attr_dict_data["STYLE"], True, False, "Unique appearance or atmosphere.")
            self.texture = Properties("TEXTURE", attr_dict_data["TEXTURE"], True, False, "")
            self.color = Properties("COLOR", attr_dict_data["COLOR"], True, True, "Identify up to 3 primary colors,")
            self.pattern = Properties("PATTERN", attr_dict_data["PATTERN"], True, False, "")
        else:
            logging.error(f"{response.request.url} 옷 속성 불러오기 실패, {str(response.json())}")
            raise ConnectionError

    def attr_dict(self):
        result = {}
        for category in self.attributes:
            category_name = category['name']
            codes = [prop['code'] for prop in category['properties']]
            result[category_name] = codes
        return result

    def category_dict(self):
        result = {}
        for category in self.categories:
            category_name = category['name']
            low_names = [item['name'] for item in category['categoryLowList']]
            result[category_name] = low_names
        return result


clothesMetadata = ClothesMetadata()
print(clothesMetadata.color.get_values())
