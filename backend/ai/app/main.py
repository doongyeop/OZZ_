from fastapi import FastAPI
from app.api.v1.endpoints import attributes, tokenize
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()


origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# API 라우터 설정
app.include_router(attributes.router, prefix="/api/v1")
app.include_router(tokenize.router)
