import logging

from dotenv import load_dotenv

from app.mq.consumer import start_consumer

load_dotenv()
logging.basicConfig(
    format='%(levelname)s:     %(message)s',
    level=logging.INFO
)

if __name__ == "__main__":
    start_consumer()