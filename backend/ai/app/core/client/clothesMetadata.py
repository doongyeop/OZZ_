import requests
from pydantic import BaseModel


class LowCategory(BaseModel):
    categoryLowId:int
    name:str

class HighCategory(BaseModel):
    categoryHighId:int
    name:str
    categoryLowList:list[LowCategory]

class Property(BaseModel):
    code:str
    name:str

class Properties(BaseModel):
    name:str
    properties:list[Property]

class ClothesMetadata:
    categories:list[HighCategory]
    attributes:list[Properties]
    def __init__(self):
        response=requests.get("http://localhost:8081/api/categories")
        if response.ok:
            self.categories=response.json()
        response=requests.get("http://localhost:8081/api/clothes/properties/all")
        if response.ok:
            self.attributes=response.json()

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

clothesMetadata=ClothesMetadata()