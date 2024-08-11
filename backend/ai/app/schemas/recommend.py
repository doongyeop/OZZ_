from typing import Union

from pydantic import BaseModel

class Clothes(BaseModel):
    id: int
    fit: Union[str|None]=None
    colorList: list[str]
    patternList: Union[list[str]|None]=None
    seasonList: Union[list[str]|None]=None
    styleList: Union[list[str]|None]=None
    textureList: Union[list[str]|None]=None
    extra: str
    category: str

class Weather(BaseModel):
    temperature: int
    weather: str

class Consider(BaseModel):
    weather: Weather
    pointColor: list[str]
    essential: list[int]
    style: str

class Recommend(BaseModel):
    clothes: list[Clothes]
    consider: Consider

class RecommendedOutfit(BaseModel):
    title: str
    items: list[int]
    recommendation_reason: str
    style: str