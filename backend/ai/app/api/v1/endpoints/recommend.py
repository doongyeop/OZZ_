from typing import Union

from fastapi import APIRouter, UploadFile, Header, Depends

from app.core.client.ExtractAttribute import ExtractAttributesImage
from app.schemas.attributes import Attributes
from app.schemas.recommend import Consider
from app.services.recommend import RecommendService

router = APIRouter(prefix="/recommend", tags=["Recommendations"])


@router.post("")
async def extract_attributes(consider: Consider,x_user_id:str = Header(default=None),service:RecommendService=Depends(RecommendService)):
    service.get_recommend_outfit(x_user_id,consider)
    return
