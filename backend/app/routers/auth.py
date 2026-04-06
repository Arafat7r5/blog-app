from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import models, utils, oauth2
from ..schemas import UserCreate, UserResponse, AdminCreate, AdminResponse, Token
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register/user", response_model=UserResponse, status_code=201)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = utils.hash_password(user.password)
    new_user = models.User(name=user.name, email=user.email, password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login/user", response_model=Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not utils.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=403, detail="Invalid credentials")

    token = oauth2.create_access_token({"user_id": user.id, "role": "user"})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/register/admin", response_model=AdminResponse, status_code=201)
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Admin).filter(models.Admin.email == admin.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = utils.hash_password(admin.password)
    new_admin = models.Admin(name=admin.name, email=admin.email, password=hashed)
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@router.post("/login/admin", response_model=Token)
def login_admin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    admin = db.query(models.Admin).filter(models.Admin.email == form_data.username).first()
    if not admin or not utils.verify_password(form_data.password, admin.password):
        raise HTTPException(status_code=403, detail="Invalid credentials")

    token = oauth2.create_access_token({"user_id": admin.id, "role": "admin"})
    return {"access_token": token, "token_type": "bearer"}