from pydantic import BaseModel
from typing import Union


class NormalizedClothes(BaseModel):
    clothId: int
    name: str
    category: str
    color: str | None
    imgUrl: str


class ImageMetadata(BaseModel):
    clothId: int
    categoryLowId: int
    imgUrl: str
    isWorn: bool


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
    isWorn: bool


class GPTAttrResponse(AttributeBase):
    parentCategory: str
    subCategory: str
    isWorn: bool


class LowCategoryResponse(BaseModel):
    categoryLowId: int
    name: str


class HighCategoryResponse(BaseModel):
    categoryHighId: int
    name: str


class AttributeResponse(AttributeBase):
    categoryHigh: HighCategoryResponse
    categoryLow: LowCategoryResponse
    image: str
