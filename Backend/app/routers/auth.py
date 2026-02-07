from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.database import get_session
from app.models import User, Wallet
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

@router.post("/register")
async def register(
    email: str,
    password: str,
    session: AsyncSession = Depends(get_session)
):
    # Check if user exists
    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    new_user = User(
        email=email,
        hashed_password=get_password_hash(password)
    )
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    # Create wallet
    wallet = Wallet(user_id=new_user.id, credits=0.0)
    session.add(wallet)
    await session.commit()

    return {"message": "User created successfully", "id": new_user.id}

@router.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session)
):
    statement = select(User).where(User.email == form_data.username)
    result = await session.execute(statement)
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}
