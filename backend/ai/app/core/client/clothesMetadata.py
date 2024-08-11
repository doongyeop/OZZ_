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


clothesMetadata=ClothesMetadata()