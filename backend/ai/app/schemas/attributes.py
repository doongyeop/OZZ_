from pydantic import BaseModel
from typing import Union


class NormalizedClothes(BaseModel):
    clothId: int
    name: str
    category: str
    color: str | None
    imgUrl: str


class AttributeBase(BaseModel):
    fit: Union[str | None] = None
    colorList: list[str]
    patternList: Union[list[str] | None] = None
    seasonList: Union[list[str] | None] = None
    styleList: Union[list[str] | None] = None
    textureList: Union[list[str] | None] = None
    extra: str


class Attributes(AttributeBase):
    categoryLowId: int


class GPTAttrResponse(AttributeBase):
    parentCategory: str
    subCategory: str
