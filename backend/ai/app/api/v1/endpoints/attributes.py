from fastapi import APIRouter, UploadFile

from app.core.client.ExtractAttribute import ExtractAttributesImage
from app.schemas.attributes import Attributes


router = APIRouter(prefix="/attributes", tags=["Attributes"])


@router.post("/extract", response_model=Attributes)
async def extract_attributes(image: UploadFile):
    client = ExtractAttributesImage(image)
    return client.get_result()
