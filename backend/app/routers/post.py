from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, oauth2
from ..schemas import PostCreate, PostResponse
from ..database import get_db

router = APIRouter(prefix="/posts", tags=["Posts"])

# View All Approved Posts (anyone)
@router.get("/approved", response_model=List[PostResponse])
def get_approved_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).filter(models.Post.approved == True).all()
    return posts

# View Pending Posts (admins only)
@router.get("/pending", response_model=List[PostResponse])
def get_unapproved_posts(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(oauth2.get_current_admin)
):
    posts = db.query(models.Post).filter(models.Post.approved == False).all()
    return posts

# View logged-in user's own posts
@router.get("/user/myposts", response_model=List[PostResponse])
def get_my_posts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    posts = db.query(models.Post).filter(models.Post.user_id == current_user.id).all()
    return posts


# Create Post (users only)
@router.post("/", response_model=PostResponse, status_code=201)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    new_post = models.Post(
        title=post.title,
        content=post.content,
        user_id=current_user.id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post


# Approve Post (admins only) 
@router.patch("/{post_id}/approve", response_model=PostResponse)
def approve_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(oauth2.get_current_admin)
):
    post = db.query(models.Post).filter(models.Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.approved:
        raise HTTPException(status_code=400, detail="Post is already approved")

    post.approved = True
    db.commit()
    db.refresh(post)
    return post
