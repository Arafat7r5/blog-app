from fastapi import FastAPI
from app.routers import auth

app = FastAPI(title="Blog App API")

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Blog App API is running!"}