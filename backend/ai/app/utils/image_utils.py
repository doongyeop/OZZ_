import requests
from fastapi import UploadFile
from rembg import remove
from io import BytesIO
from PIL import Image
import base64


def remove_background_and_encode(image_file: UploadFile) -> str:
    # 이미지 파일 읽기
    input_image = Image.open(image_file.file)

    input_image = resize_and_convert_to_png(input_image)

    # 배경 제거
    output_image = remove(input_image)

    # 결과 이미지를 바이트 스트림으로 변환
    output_stream = BytesIO()
    output_image.save(output_stream, format="PNG")
    output_stream.seek(0)

    # 바이트 스트림을 base64로 인코딩
    base64_encoded_image = base64.b64encode(output_stream.read()).decode('utf-8')

    return base64_encoded_image


def image_to_base64str(image: Image):
    # 결과 이미지를 바이트 스트림으로 변환
    output_stream = BytesIO()
    image.save(output_stream, format="PNG")
    output_stream.seek(0)

    # 바이트 스트림을 base64로 인코딩
    base64_encoded_image_str = base64.b64encode(output_stream.read()).decode('utf-8')
    return base64_encoded_image_str


def resize_and_convert_to_png(image: Image) -> Image:
    max_size = 300
    width, height = image.size

    # 긴 변을 기준으로 비율을 유지하면서 크기 조정
    if width > height:
        if width > max_size:
            ratio = max_size / float(width)
            new_height = int(height * ratio)
            image = image.resize((max_size, new_height))
    else:
        if height > max_size:
            ratio = max_size / float(height)
            new_width = int(width * ratio)
            image = image.resize((new_width, max_size))

    # 이미지 형식을 PNG로 변환
    if image.mode in ("RGBA", "P"):
        image = image.convert("RGBA")
    else:
        image = image.convert("RGB")

    return image


def download_img(image_url: str) -> Image:
    # 이미지 다운로드
    response = requests.get(image_url)
    return Image.open(BytesIO(response.content))