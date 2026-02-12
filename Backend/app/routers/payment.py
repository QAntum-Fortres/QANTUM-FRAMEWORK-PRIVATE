import os
import stripe
import logging
from fastapi import APIRouter, Request, HTTPException, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from pydantic import BaseModel

from app.database import get_session
from app.models import User, Wallet, Transaction, UserModule

# Config
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(prefix="/payment", tags=["payment"])
logger = logging.getLogger("payment")

PRICING_TIERS = {
    "singularity": {"price_id": "price_singularity_mock", "credits": 100, "modules": ["basic_analytics"]},
    "aeterna": {"price_id": "price_aeterna_mock", "credits": 500, "modules": ["basic_analytics", "advanced_arbitrage", "ai_insights"]},
    "vortex": {"price_id": "price_vortex_mock", "credits": 2000, "modules": ["basic_analytics", "advanced_arbitrage", "ai_insights", "enterprise_support", "custom_integrations"]},
}

class CheckoutRequest(BaseModel):
    tier: str
    userEmail: str
    successUrl: str
    cancelUrl: str

async def process_success(email: str, tier: str, session: AsyncSession):
    # Find user by email
    stmt = select(User).where(User.email == email)
    res = await session.execute(stmt)
    user = res.scalars().first()

    if not user:
        logger.warning(f"Payment received for unknown user: {email}")
        return

    tier_config = PRICING_TIERS.get(tier, PRICING_TIERS['singularity'])
    credits_to_add = tier_config['credits']
    modules_to_unlock = tier_config['modules']

    # 1. Add Credits
    if not user.wallet: # Should rely on relationship loading or ensuring it exists
         # In async usage, relationships might need explicit handling if not lazy loaded correctly or eager loaded.
         # For simplicity, assuming we can query or create.
         stmt_w = select(Wallet).where(Wallet.user_id == user.id)
         res_w = await session.execute(stmt_w)
         wallet = res_w.scalars().first()
         if not wallet:
             wallet = Wallet(user_id=user.id, credits=0.0)
             session.add(wallet)
         wallet.credits += credits_to_add
    else:
        user.wallet.credits += credits_to_add

    # 2. Unlock Modules
    for mod_name in modules_to_unlock:
        # check if exists
        stmt_mod = select(UserModule).where(UserModule.user_id == user.id, UserModule.module_name == mod_name)
        res_mod = await session.execute(stmt_mod)
        if not res_mod.scalars().first():
            new_mod = UserModule(user_id=user.id, module_name=mod_name)
            session.add(new_mod)

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

@router.post("/create-checkout-session")
async def create_checkout_session(req: CheckoutRequest):
    if not STRIPE_SECRET_KEY:
        # Mock mode for Dev
        return {
            "success": True,
            "url": f"{req.successUrl}?mock_payment=true&tier={req.tier}",
            "message": "Dev Mode: Mocking successful redirect"
        }

    try:
        tier_data = PRICING_TIERS.get(req.tier)
        if not tier_data:
            raise HTTPException(status_code=400, detail="Invalid Tier")

        # Use a mock Price ID if specific one isn't set, but in real life need real Stripe Price IDs
        # We can use ad-hoc line items for simplicity if Price IDs aren't managed.
        # But best practice is Price IDs. For now, we simulate.

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f"QANTUM {req.tier.title()} Plan",
                    },
                    'unit_amount': 2900 if req.tier == 'singularity' else (9900 if req.tier == 'aeterna' else 29900),
                },
                'quantity': 1,
            }],
            mode='subscription',
            success_url=req.successUrl,
            cancel_url=req.cancelUrl,
            customer_email=req.userEmail,
            metadata={
                'tier': req.tier
            }
        )
        return {"success": True, "url": session.url}

    except Exception as e:
        logger.error(f"Stripe Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
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
