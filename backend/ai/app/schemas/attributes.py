from pydantic import BaseModel
from typing import List


class Attributes(BaseModel):
    fit: str
    colorList: List[str]
    patternList: List[str]
    seasonList: List[str]
    styleList: List[str]
    textureList: List[str]
    extra: str
    categoryLowId: int

class NormalizedClothes(BaseModel):
    clothId:int
    name:str
    category:str
    color:str
    imgUrl:str