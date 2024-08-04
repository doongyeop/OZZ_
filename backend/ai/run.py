import uvicorn
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    uvicorn.run("app.main:app", port=8000, reload=True)