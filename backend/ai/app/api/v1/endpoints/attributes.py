import base64
import io

from fastapi import APIRouter, UploadFile, Form, File, Query

from app.core.client.ExtractAttribute import ExtractAttributesImage

from app.schemas.attributes import AttributeResponse
from app.utils.image_utils import remove_background_and_encode

router = APIRouter(prefix="/attributes", tags=["Attributes"])

@router.post("/extract", response_model=AttributeResponse )
async def extract_attributes(image: UploadFile = File(...), highCategory: str = Form(...)):
    image_data=image.file.read()

    # Encode the file content to Base64
    base64_encoded = base64.b64encode(image_data)

    # Convert the Base64 bytes to a string
    base64_string = base64_encoded.decode('utf-8')
    client = ExtractAttributesImage(base64_string, highCategory)
    result = client.get_result()
    print(result)
    highCate, lowCate =  client.clothes_metadata.low_categoryId_to_low_high_response(result.categoryLowId)
    print(str(highCate), str(lowCate))
    if result.isWorn:
        pass
    else:
        base64_string = remove_background_and_encode(image)


    return {**result.model_dump(exclude={"categoryLowId","isWorn"}),
            "categoryHigh":highCate,
            "categoryLow":lowCate,
            "image":base64_string}
