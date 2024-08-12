from pydantic import BaseModel
from typing import List, Union


class Attributes(BaseModel):
    fit: Union[str|None]=None
    colorList: list[str]
    patternList: Union[list[str]|None]=None
    seasonList: Union[list[str]|None]=None
    styleList: Union[list[str]|None]=None
    textureList: Union[list[str]|None]=None
    extra: str
    categoryLowId: int

class NormalizedClothes(BaseModel):
    clothId:int
    name:str
    category:str
    color:str|None
    imgUrl:str