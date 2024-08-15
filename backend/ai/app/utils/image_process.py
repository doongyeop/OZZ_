import logging
from typing import Union

from rembg import remove
from transformers import SegformerImageProcessor, AutoModelForSemanticSegmentation
from PIL import Image
import torch.nn as nn
import numpy as np
import requests
from io import BytesIO

# Load the processor and model
processor = SegformerImageProcessor.from_pretrained("sayeed99/segformer-b2-fashion")
segformer_model = AutoModelForSemanticSegmentation.from_pretrained("sayeed99/segformer-b2-fashion")

category2label = {
    "top": ["top, t-shirt, sweatshirt", "shirt, blouse", "sweater", "hood", "vest", "jacket", "cardigan"],
    "bottom": ["pants", "skirt", "tights", "stockings", 'shorts'],
    "outerwear": ["coat", "vest", "jacket", "cardigan"],
    "dress": ["dress", "jumpsuit"],
    "shoes": ["shoe"],
    "bag": ['bag, wallet'],
    "상의": ["top, t-shirt, sweatshirt", "shirt, blouse", "sweater", "hood", "vest", "jacket", "cardigan"],
    "하의": ["pants", "skirt", "tights", "stockings", 'shorts'],
    "아우터": ["coat", "vest", "jacket", "cardigan"],
    "원피스": ["dress", "jumpsuit"],
    "신발": ["shoe"],
    "가방": ['bag, wallet']
}

accessory_to_label = {"모자": [15], "주얼리": [], "기타": [14, 19, 20, 23]}
category_name_to_label = {
    "상의": [1, 2, 3, 28, 29, 30, 31, 32, 34, 36],
    "하의": [7, 8, 9, 11, 21, 22, 33],
    "아우터": [4, 5, 6, 10, 1, 2, 3, 28, 29, 30, 31, 32, 34, 36],
    "원피스": [11, 12, 13],
    "신발": [23, 24],
    "가방": [25],
    "악세서리": accessory_to_label
}


class MultiClassSegmentObjectExtractor:
    def __init__(self, processor, model, category_to_labels: dict[str, list[int] | dict[str, list[int]]]):
        self.processor = processor
        self.model = model
        self.category_to_labels = category_to_labels

    def segment_image(self, image, target_classes:list[int]):
        # 이미지를 모델에 넣고 세그먼테이션 결과 얻기
        inputs = self.processor(images=image, return_tensors="pt")
        outputs = self.model(**inputs)
        logits = outputs.logits.cpu()

        # 업샘플링하여 원본 이미지 크기에 맞추기
        upsampled_logits = nn.functional.interpolate(
            logits,
            size=image.size[::-1],
            mode="bilinear",
            align_corners=False,
        )

        # 여러 클래스에 대한 마스크 결합
        pred_seg = upsampled_logits.argmax(dim=1)[0].numpy()
        mask = np.isin(pred_seg, target_classes).astype(np.uint8)  # 여러 클래스의 마스크 생성

        return mask

    def category_name_to_label(self, high_category_name: str, low_category_name: str = None) -> list[int]:
        if high_category_name not in self.category_to_labels:
            raise ValueError(f"High Category {high_category_name} not in high category name to label")
        target_classes = self.category_to_labels[high_category_name]
        if isinstance(target_classes, dict) and low_category_name is not None:
            target_classes = target_classes[low_category_name]

        return target_classes

    def apply_mask(self, image, mask):
        # 마스크를 이용하여 투명한 배경으로 이미지 만들기
        image_np = np.array(image)
        alpha_channel = mask * 255  # 마스크를 알파 채널로 변환 (0 또는 255)
        image_rgba = np.dstack((image_np, alpha_channel))  # RGBA 이미지 생성

        return Image.fromarray(image_rgba)

    def crop_to_object(self, image, mask):
        # 마스크의 경계에 따라 이미지를 크롭
        coords = np.column_stack(np.where(mask > 0))
        if coords.size == 0:
            return image  # 객체가 없는 경우 원본 이미지 반환
        top_left = coords.min(axis=0)
        bottom_right = coords.max(axis=0)
        cropped_image = image.crop((*top_left[::-1], *bottom_right[::-1]))  # 크롭

        return cropped_image

    def extract_objects(self, image, high_category_name: str, low_category_name: str = None) -> Union[None, Image]:
        # 전체 파이프라인 실행 (여러 클래스 대상)
        target_classes = self.category_name_to_label(high_category_name, low_category_name)
        mask = self.segment_image(image, target_classes)

        # 마스크가 모두 0인 경우 (즉, 원하는 클래스가 없는 경우) 원본 이미지 반환
        if mask.sum() == 0:
            return None

        transparent_image = self.apply_mask(image, mask)
        cropped_image = self.crop_to_object(transparent_image, mask)

        return cropped_image


extractor = MultiClassSegmentObjectExtractor(processor, segformer_model, category_name_to_label)


def process(image: Image, high_category: str, low_category: str = None, basic_remove_bg: bool = False) -> Image:
    if basic_remove_bg:
        return remove(image)

    if high_category in ["accessory", "악세서리"]:
        processing_image = extractor.extract_objects(image, "악세서리", low_category)
    else:
        processing_image = extractor.extract_objects(image, high_category)

    # 인식된 객체가 없다면 단순 배경 제거후 리턴
    if processing_image is None:
        return remove(image)

    return processing_image
