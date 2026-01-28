from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    role: str = Field(default="user") # "user", "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    wallet: Optional["Wallet"] = Relationship(back_populates="user")
    transactions: List["Transaction"] = Relationship(back_populates="user")
    modules: List["UserModule"] = Relationship(back_populates="user")

class Wallet(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    credits: float = Field(default=0.0)

    user: Optional[User] = Relationship(back_populates="wallet")

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    amount: float
    transaction_type: str # "mint", "unlock", "payment"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    details: Optional[str] = None

    user: Optional[User] = Relationship(back_populates="transactions")

class Module(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    description: Optional[str] = None
    cost: float = Field(default=0.0)

class UserModule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    module_name: str # Storing name directly for simpler lookups or link to Module table
    unlocked_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="modules")

class LedgerEntry(SQLModel, table=True):
    """
    The Immutable Ledger (Database version).
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    block_hash: str
    entropy_index: float
    bio_stress: float
    market_stress: float
    energy_stress: float
    decision: str
