from fastapi import FastAPI

app = FastAPI(title="Blog App API")

@app.get("/")
def root():
    return {"message": "Blog App API is running!"}