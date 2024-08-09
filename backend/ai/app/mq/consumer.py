import json
from io import BytesIO

import pika
import requests

from app.core.client.ExtractAttribute import ExtractAttributesURL
from app.schemas.attributes import NormalizedClothes
from app.utils.image_process import process


def parseToBaseModel(body)->list[NormalizedClothes]:
    data: list[dict] = json.loads(body)
    return list(map(lambda a:NormalizedClothes(**a), data))

def EAcallback(ch, method, properties, body):
    print(f"속성 추출 :  {body}")
    data = parseToBaseModel(body)

    client = ExtractAttributesURL(data)
    data = client.get_result()
    for key in data.keys():
        # 엔드포인트 URL 및 clothesId 설정
        url = 'http://your-server.com/{clothesId}'.format(clothesId=key)
        # 요청 헤더 및 파일 설정
        body = {
            'request': (None, data[key].model_dump_json(), 'application/json')
        }

        # PUT 요청 보내기
        response = requests.put(url, files=body)

        # 응답 출력
        print(response.status_code)
        print(response.json())


def IPcallback(ch, method, properties, body):
    print(f"이미지 처리 :  {body}")
    data = parseToBaseModel(body)
    for datum in data:
        processed_image = process(datum.imgUrl, datum.category)
        # BytesIO 객체에 이미지 저장
        image_byte_array = BytesIO()
        processed_image.save(image_byte_array, format='PNG')
        image_byte_array.seek(0)

        # 엔드포인트 URL 및 clothesId 설정
        url = 'http://locahost/{clothesId}'.format(clothesId=datum.clothId)

        # 요청 헤더 및 파일 설정
        headers = {'Content-Type': 'multipart/form-data'}
        files = {'imageFile': ('image.jpg', image_byte_array, 'image/jpeg')}

        # PUT 요청 보내기
        response = requests.put(url, headers=headers, files=files)

        # 응답 출력
        print(response.status_code)
        print(response.json())

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

channel.queue_declare(queue='extract-attribute')
channel.queue_declare(queue='image-process')

channel.basic_consume(queue='extract-attribute',
                      on_message_callback=EAcallback,
                      auto_ack=True)
channel.basic_consume(queue='image-process',
                      on_message_callback=IPcallback,
                      auto_ack=True)

print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
