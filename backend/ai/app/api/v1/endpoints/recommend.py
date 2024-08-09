from typing import Union

from fastapi import APIRouter, UploadFile, Header

from app.core.client.ExtractAttribute import ExtractAttributesImage
from app.schemas.attributes import Attributes


router = APIRouter(prefix="/recommend", tags=["Recommendations"])


@router.post("/")
async def extract_attributes(x_user_id:str = Header(default=None)):

    return
