import io
import os

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


def resize_and_convert_to_png(image: Image) -> Image:
    max_size = 512
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


def make_snapshot(items: list[tuple[int, int, str]]) -> str:
    # 기본 하얀 배경 이미지 생성 (9:16 비율, 예: 900x1600)
    width, height = 900, 1600
    background = Image.new('RGB', (width, height), (255, 255, 255))

    position = [None, (330, 200), (140, 250), (350, 350), (340, 350), (350, 450), (80, 750), (350, 600)]
    # 삽입할 이미지 불러오기
    for item in items:
        response = requests.get(f"{os.getenv('FILE_HOST')}/api/file/download/{item[2]}")
        image = Image.open(BytesIO(response.content))
        background.paste(image, position[item[1]])

    # 결과 이미지 저장
    img_byte_arr = io.BytesIO()
    background.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()

    # 이미지 데이터를 Base64로 인코딩
    img_base64 = base64.b64encode(img_byte_arr).decode('utf-8')

    return img_base64
