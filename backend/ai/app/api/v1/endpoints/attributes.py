from fastapi import APIRouter, HTTPException
from app.schemas.attributes import AttributesRequest,  AttributesResponse
from app.services.attributes import extract_attributes

router = APIRouter(prefix="/attributes", tags=["Attributes"])

@router.post("/extract")
async def extract_attr(request: AttributesRequest):
    pass

    return AttributesResponse
