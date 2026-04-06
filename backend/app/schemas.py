from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# User Schemas

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


# Admin Schemas

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


# Token Schemas

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None
    role: Optional[str] = None


# Post Schemas 

class PostCreate(BaseModel):
    title: str
    content: str

class PostResponse(BaseModel):
    post_id: int
    title: str
    content: str
    approved: bool
    created_at: datetime
    author: UserResponse

    class Config:
        from_attributes = True