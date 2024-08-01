import openai
import os

class Settings:
    OPENAI_API_KEY: str = os.getenv('OPENAI_API_KEY')


settings = Settings()
openai.api_key = settings.OPENAI_API_KEY
