import json

import pika

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
    client.get_result()
    # ToDO : 데이터 저장


def IPcallback(ch, method, properties, body):
    print(f"이미지 처리 :  {body}")
    data = parseToBaseModel(body)
    for datum in data:
        process(datum.imgUrl, datum.category)
        # TODO : 처리된 이미지 업로드



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
