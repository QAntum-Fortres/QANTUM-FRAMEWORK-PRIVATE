from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List, Dict

from app.database import get_session
from app.models import User, Wallet, UserModule, Transaction

router = APIRouter(prefix="/economy", tags=["economy"])

@router.get("/balance/{user_id}")
async def get_balance(user_id: int, session: AsyncSession = Depends(get_session)):
    statement = select(Wallet).where(Wallet.user_id == user_id)
    result = await session.execute(statement)
    wallet = result.scalars().first()
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    # Get modules
    mod_stmt = select(UserModule).where(UserModule.user_id == user_id)
    mod_res = await session.execute(mod_stmt)
    modules = mod_res.scalars().all()

    return {
        "user_id": user_id,
        "credits": wallet.credits,
        "unlocked_modules": [m.module_name for m in modules]
    }

@router.post("/mint")
async def mint_credits(
    user_id: int,
    amount: float,
    session: AsyncSession = Depends(get_session)
):
    # Retrieve wallet
    statement = select(Wallet).where(Wallet.user_id == user_id)
    result = await session.execute(statement)
    wallet = result.scalars().first()

    if not wallet:
        # Create if missing (fail-safe)
        wallet = Wallet(user_id=user_id, credits=0.0)
        session.add(wallet)

    wallet.credits += amount

    # Audit log
    tx = Transaction(
        user_id=user_id,
        amount=amount,
        transaction_type="mint",
        details="Admin/System Mint"
    )
    session.add(tx)

    await session.commit()
    await session.refresh(wallet)
    return {"status": "success", "new_balance": wallet.credits}

@router.post("/unlock")
async def unlock_module(
    user_id: int,
    module_name: str,
    cost: float,
    session: AsyncSession = Depends(get_session)
):
    # Check wallet
    statement = select(Wallet).where(Wallet.user_id == user_id)
    result = await session.execute(statement)
    wallet = result.scalars().first()

    if not wallet or wallet.credits < cost:
        raise HTTPException(status_code=400, detail="Insufficient credits")

    # Check if already unlocked
    stmt_check = select(UserModule).where(
        UserModule.user_id == user_id,
        UserModule.module_name == module_name
    )
    res_check = await session.execute(stmt_check)
    if res_check.scalars().first():
         return {"status": "already_unlocked", "balance": wallet.credits}

    # Deduct
    wallet.credits -= cost

    # Unlock
    new_module = UserModule(user_id=user_id, module_name=module_name)
    session.add(new_module)

    # Audit
    tx = Transaction(
        user_id=user_id,
        amount=-cost,
        transaction_type="unlock",
        details=f"Unlocked {module_name}"
    )
    session.add(tx)

    await session.commit()
    return {"status": "unlocked", "new_balance": wallet.credits}
