from fastapi import FastAPI
from app.database import engine
from app import models

# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blog App API")

@app.get("/")
def root():
    return {"message": "Blog App API is running!"}