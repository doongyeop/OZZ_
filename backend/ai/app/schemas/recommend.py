from pydantic import BaseModel

class Clothes(BaseModel):
    id: int
    fit: str
    colorList: list[str]
    patternList: list[str]
    seasonList: list[str]
    styleList: list[str]
    textureList: list[str]
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