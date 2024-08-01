from fastapi import FastAPI
from app.api.v1.endpoints import attributes

app = FastAPI()

# API 라우터 설정
app.include_router(attributes.router, prefix="/api/v1")
