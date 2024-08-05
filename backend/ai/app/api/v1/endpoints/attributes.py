from typing import List

from fastapi import APIRouter, UploadFile, Depends, Form

from app.schemas.attributes import AttributesResponse
from app.services.attributes import AttributeService

router = APIRouter(prefix="/attributes", tags=["Attributes"])


@router.post("/extract", response_model=List[AttributesResponse])
async def extract_attributes(images: List[UploadFile], infos: str = Form(...),
                             service: AttributeService = Depends(AttributeService)):
    infos = infos.strip().split(",")
    attributes = service.extract_attributes(images, infos)
    return attributes
