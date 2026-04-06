from fastapi import FastAPI
from app.routers import auth, post

app = FastAPI(title="Blog App API")

app.include_router(auth.router)
app.include_router(post.router)

@app.get("/")
def root():
    return {"message": "Blog App API is running!"}