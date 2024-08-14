import logging

from rembg import remove
from transformers import SegformerImageProcessor, AutoModelForSemanticSegmentation
from PIL import Image
import torch.nn as nn
import numpy as np
import requests
from io import BytesIO
import torch
from transformers import YolosFeatureExtractor, YolosForObjectDetection

# Load the processor and model
processor = SegformerImageProcessor.from_pretrained("mattmdjaga/segformer_b2_clothes")
segformer_model = AutoModelForSemanticSegmentation.from_pretrained("mattmdjaga/segformer_b2_clothes")

# YOLOs 모델 불러오기
feature_extractor = YolosFeatureExtractor.from_pretrained('hustvl/yolos-small')
yolo_model = YolosForObjectDetection.from_pretrained("valentinafeve/yolos-fashionpedia")


class ProcessingImage():
    mask_array = None
    # Define the segments you want to remove
    # Background, Hair, Face, Left-leg, Right-leg, Left-arm, Right-arm
    segments_to_remove = [0, 2, 11, 12, 13, 14, 15]


    def __init__(self, baseImage:Image):
        if baseImage.mode != 'RGB':
            baseImage = baseImage.convert('RGB')
        self.baseImage=baseImage
        self.make_mask_array()


    def make_mask_array(self):
        inputs = processor(images=self.baseImage, return_tensors="pt")
        outputs = segformer_model(**inputs)
        logits = outputs.logits.cpu()
        upsampled_logits = nn.functional.interpolate(
            logits,
            size=self.baseImage.size[::-1],
            mode="bilinear",
            align_corners=False,
        )

        # Get the segmentation mask
        pred_seg = upsampled_logits.argmax(dim=1)[0]

        # Convert the mask to a numpy array
        self.mask_array = pred_seg.numpy()

    def get_not_transparent_only_human_image(self)->Image:
        r,g,b,_=self.__get_rgba__([0])
        return self.__merge_images__(r,g,b)

    def get_transparent_only_item_image(self)->Image:
        r,g,b,a=self.__get_rgba__(self.segments_to_remove)
        return self.__merge_images__(r,g,b,a)


    def __get_rgba__(self,segments_to_remove):
        # Create a mask where the segments to remove are set to 1, others to 0
        mask = np.isin(self.mask_array, segments_to_remove).astype(np.uint8)

        # Split the original image into channels
        r, g, b = self.baseImage.split()

        # If the original image had an alpha channel, re-add it
        a = Image.fromarray(np.ones_like(np.array(r)) * 255).convert("L")

        # Update the RGB channels to white based on the mask
        r_np = np.array(r)
        g_np = np.array(g)
        b_np = np.array(b)
        r_np[mask == 1] = 255
        g_np[mask == 1] = 255
        b_np[mask == 1] = 255

        # Update the alpha channel based on the mask
        a_np = np.array(a)
        a_np[mask == 1] = 0

        # Convert the updated channels back to images
        r = Image.fromarray(r_np)
        g = Image.fromarray(g_np)
        b = Image.fromarray(b_np)
        a = Image.fromarray(a_np)
        return r, g, b, a

    def __merge_images__(self,r,g,b,a=None)->Image:
        if a is None:
            return Image.merge("RGB", (r, g, b))
        else:
            return Image.merge("RGBA", (r, g, b, a))


def download_img(image_url: str) -> Image:
    # 이미지 다운로드
    response = requests.get(image_url)
    return Image.open(BytesIO(response.content))


def leave_only_clothes(image: Image) -> tuple[Image, Image]:
    if image.mode != 'RGB':
        # Convert the image to RGB (3 channels)
        image = image.convert("RGB")

    # Process the image and get model outputs
    inputs = processor(images=image, return_tensors="pt")
    outputs = segformer_model(**inputs)
    logits = outputs.logits.cpu()

    # Upsample the logits to the original image size
    upsampled_logits = nn.functional.interpolate(
        logits,
        size=image.size[::-1],
        mode="bilinear",
        align_corners=False,
    )

    # Get the segmentation mask
    pred_seg = upsampled_logits.argmax(dim=1)[0]

    # Convert the mask to a numpy array
    pred_seg_np = pred_seg.numpy()

    # Define the segments you want to remove
    # Background, Hair, Face, Left-leg, Right-leg, Left-arm, Right-arm
    segments_to_remove = [0, 2, 11, 12, 13, 14, 15]

    # Create a mask where the segments to remove are set to 1, others to 0
    mask = np.isin(pred_seg_np, segments_to_remove).astype(np.uint8)

    # Split the original image into channels
    r, g, b = image.split()

    # If the original image had an alpha channel, re-add it
    a = Image.fromarray(np.ones_like(np.array(r)) * 255).convert("L")

    # Update the RGB channels to white based on the mask
    r_np = np.array(r)
    g_np = np.array(g)
    b_np = np.array(b)
    r_np[mask == 1] = 255
    g_np[mask == 1] = 255
    b_np[mask == 1] = 255

    # Update the alpha channel based on the mask
    a_np = np.array(a)
    a_np[mask == 1] = 0

    # Convert the updated channels back to images
    r = Image.fromarray(r_np)
    g = Image.fromarray(g_np)
    b = Image.fromarray(b_np)
    a = Image.fromarray(a_np)

    # Merge the channels back
    transparent_image = Image.merge("RGBA", (r, g, b, a))
    not_transparent_image = Image.merge("RGB", (r, g, b))
    return transparent_image, not_transparent_image


def cropImg(category: str, trans_image: Image, image: Image) -> Image:
    # 잘라내기할 카테고리와 라벨 매핑
    if category == "accessory":
        return
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
    # 이미지 입력 준비
    inputs = feature_extractor(images=image, return_tensors="pt")

    # 객체 탐지
    outputs = yolo_model(**inputs)

    # 결과 시각화 및 객체 저장
    probas = outputs.logits.softmax(-1)[0, :, :-1]
    bboxes_scaled = rescale_bboxes(outputs.pred_boxes[0].cpu(), image.size)
    return crop_objects(trans_image, probas, bboxes_scaled, category2label[category], threshold=0.5)


# Bounding box와 클래스 정보를 얻어오기
def box_cxcywh_to_xyxy(x):
    x_c, y_c, w, h = x.unbind(1)
    b = [(x_c - 0.5 * w), (y_c - 0.5 * h),
         (x_c + 0.5 * w), (y_c + 0.5 * h)]
    return torch.stack(b, dim=1)


def rescale_bboxes(out_bbox, size):
    img_w, img_h = size
    b = box_cxcywh_to_xyxy(out_bbox)
    b = b * torch.tensor([img_w, img_h, img_w, img_h], dtype=torch.float32)
    return b


def idx_to_text(i):
    cats = ['shirt, blouse', 'top, t-shirt, sweatshirt', 'sweater', 'cardigan', 'jacket', 'vest', 'pants', 'shorts',
            'skirt', 'coat', 'dress', 'jumpsuit', 'cape', 'glasses', 'hat', 'headband, head covering, hair accessory',
            'tie', 'glove', 'watch', 'belt', 'leg warmer', 'tights, stockings', 'sock', 'shoe', 'bag, wallet', 'scarf',
            'umbrella', 'hood', 'collar', 'lapel', 'epaulette', 'sleeve', 'pocket', 'neckline', 'buckle', 'zipper',
            'applique', 'bead', 'bow', 'flower', 'fringe', 'ribbon', 'rivet', 'ruffle', 'sequin', 'tassel']
    return cats[i]


def crop_objects(pil_img, prob, boxes, labels, threshold=0.8) -> Image:
    keep = prob.max(-1).values > threshold
    for idx, (p, (xmin, ymin, xmax, ymax)) in enumerate(zip(prob[keep], boxes[keep].tolist())):
        cl = p.argmax()
        if idx_to_text(cl) in labels:
            cropped_img = pil_img.crop((xmin, ymin, xmax, ymax))
            return cropped_img


def process(imgUrl, category) -> Image:
    downloaded_img = download_img(imgUrl)
    logging.info("image download from " + imgUrl)
    trans_img, not_trans_img = leave_only_clothes(downloaded_img)
    logging.info("image leaved only clothes -> url : " + imgUrl)
    image = cropImg(category, trans_img, not_trans_img)
    if image is not None:
        logging.info("image croped category : " + category)
        return image
    else:
        logging.info("image not croped category : " + category)
        return remove(downloaded_img)


def process_image(image: Image, category: str) -> str:
    if category == "악세서리":
        trans_img, not_trans_img = leave_only_clothes(image)
    else:
        image=remove(image)
    logging.info("image leaved only clothes")
    cropped_image = cropImg(category, trans_img, not_trans_img)
    if cropped_image is not None:
        logging.info("image croped category : " + category)
        return cropped_image
    else:
        logging.info("image not croped category : " + category)
        return trans_img

