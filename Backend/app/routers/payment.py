import os
import stripe
import logging
from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select

from app.database import get_session
from app.models import User, Wallet, Transaction, UserModule

# Config
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(prefix="/webhook", tags=["payment"])
logger = logging.getLogger("payment")

PRICING_TIERS = {
    "singularity": {"credits": 100, "modules": ["basic_analytics"]},
    "aeterna": {"credits": 500, "modules": ["basic_analytics", "advanced_arbitrage", "ai_insights"]},
    "vortex": {"credits": 2000, "modules": ["basic_analytics", "advanced_arbitrage", "ai_insights", "enterprise_support", "custom_integrations"]},
}

async def process_success(email: str, tier: str, session: AsyncSession):
    # Find user by email
    stmt = select(User).options(selectinload(User.wallet)).where(User.email == email)
    res = await session.execute(stmt)
    user = res.scalars().first()

    if not user:
        logger.warning(f"Payment received for unknown user: {email}")
        return

    tier_config = PRICING_TIERS.get(tier, PRICING_TIERS['singularity'])
    credits_to_add = tier_config['credits']
    modules_to_unlock = tier_config['modules']

    # 1. Add Credits
    wallet = user.wallet
    if not wallet:
        wallet = Wallet(user_id=user.id, credits=0.0)
        session.add(wallet)

    wallet.credits += credits_to_add

    # 2. Unlock Modules
    if modules_to_unlock:
        # check if exists
        unique_modules_to_unlock = set(modules_to_unlock)
        stmt_existing = select(UserModule.module_name).where(
            UserModule.user_id == user.id,
            UserModule.module_name.in_(unique_modules_to_unlock)
        )
        res_existing = await session.execute(stmt_existing)
        existing_modules = set(res_existing.scalars().all())

        new_modules = []
        for mod_name in unique_modules_to_unlock:
            if mod_name not in existing_modules:
                new_modules.append(UserModule(user_id=user.id, module_name=mod_name))

        if new_modules:
            session.add_all(new_modules)

    # 3. Log Transaction
    tx = Transaction(
        user_id=user.id,
        amount=credits_to_add,
        transaction_type="payment",
        details=f"Stripe Tier: {tier}"
    )
    session.add(tx)

    await session.commit()
    logger.info(f"Processed payment for {email}: +{credits_to_add} credits")

@router.post("/stripe")
async def stripe_webhook(request: Request, session: AsyncSession = Depends(get_session)):
    payload = await request.body()
    sig_header = request.headers.get('Stripe-Signature')

    event = None
    try:
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            # Dev mode
            data = await request.json()
            event = stripe.Event.construct_from(data, stripe.api_key)

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session_obj = event['data']['object']
        email = session_obj.get('customer_email')
        metadata = session_obj.get('metadata', {})
        tier = metadata.get('tier', 'singularity')

        if email:
            await process_success(email, tier, session)

    return {"status": "success"}
