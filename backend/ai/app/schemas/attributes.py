from fastapi import UploadFile, File
from fastapi.openapi.models import Info
from pydantic import BaseModel
from typing import List


class AttributesResponse(BaseModel):
    fit: str
    colorList: List[str]
    patternList: List[str]
    seasonList: List[str]
    styleList: List[str]
    textureList: List[str]
    extra: str
    category: str