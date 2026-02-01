import pytest
import time
import asyncio
from unittest.mock import patch
from sqlmodel import SQLModel, select
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
import sys
import os

# Add Backend to sys.path if not present
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.routers.payment import process_success, PRICING_TIERS
from app.models import User, UserModule

# Setup in-memory DB
DATABASE_URL = "sqlite+aiosqlite:///:memory:"
engine = create_async_engine(DATABASE_URL, echo=False, future=True)

import pytest_asyncio

@pytest_asyncio.fixture
async def session():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

@pytest.mark.asyncio
async def test_benchmark_process_success(session):
    # Setup
    email = "test@example.com"
    user = User(email=email, hashed_password="pw")
    session.add(user)
    await session.commit()
    await session.refresh(user)

    # Monkeypatch PRICING_TIERS to have many modules
    many_modules = [f"mod_{i}" for i in range(100)]

    with patch.dict(PRICING_TIERS, {"benchmark_tier": {"credits": 100, "modules": many_modules}}):

        # Measure time
        start_time = time.time()
        await process_success(email, "benchmark_tier", session)
        end_time = time.time()

        duration = end_time - start_time
        print(f"\nExecution time for 100 modules: {duration:.4f} seconds")

        # Verify
        result = await session.execute(select(UserModule).where(UserModule.user_id == user.id))
        modules = result.scalars().all()
        assert len(modules) == 100
