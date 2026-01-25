"""
Stripe Webhook Handler - Wealth Bridge
==========================================
Listens for checkout.session.completed events from Stripe
and automatically mints credits in the Rust Economy module.
"""

import os
import stripe
import requests
import logging
from flask import Flask, request, jsonify

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")
RUST_ECONOMY_URL = os.environ.get("RUST_ECONOMY_URL", "http://localhost:8890")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

app = Flask(__name__)

# Pricing tiers - maps Stripe Price IDs to credit amounts
PRICING_TIERS = {
    "singularity": {"credits": 100, "modules": ["basic_analytics"]},
    "aeterna": {"credits": 500, "modules": ["basic_analytics", "advanced_arbitrage", "ai_insights"]},
    "vortex": {"credits": 2000, "modules": ["basic_analytics", "advanced_arbitrage", "ai_insights", "enterprise_support", "custom_integrations"]},
}

def mint_credits_in_rust(user_id: str, amount: float) -> dict:
    """
    Call Rust Economy server to mint credits for a user.
    """
    try:
        url = f"{RUST_ECONOMY_URL}/api/mint_credits"
        payload = {
            "user_id": user_id,
            "amount": amount
        }
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Failed to mint credits in Rust: {e}")
        raise

def unlock_modules_in_rust(user_id: str, modules: list) -> list:
    """
    Unlock modules for a user in Rust Economy server.
    """
    results = []
    for module in modules:
        try:
            url = f"{RUST_ECONOMY_URL}/api/unlock_module"
            payload = {
                "user_id": user_id,
                "module_name": module,
                "cost": 0  # Free unlock as part of subscription
            }
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()
            results.append({"module": module, "success": True, "data": response.json()})
        except Exception as e:
            logger.error(f"Failed to unlock module {module}: {e}")
            results.append({"module": module, "success": False, "error": str(e)})
    return results

@app.route('/webhook/stripe', methods=['POST'])
def stripe_webhook():
    """
    Stripe Webhook Endpoint - The Critical "Wealth Bridge"
    Listens for checkout.session.completed events.
    """
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')

    try:
        # Verify webhook signature (if secret is configured)
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            # Development mode - no verification
            event = stripe.Event.construct_from(
                request.json, stripe.api_key
            )
            logger.warning("⚠️ Webhook signature verification disabled - Development mode")

        logger.info(f"📨 Received Stripe event: {event['type']}")

        # Handle checkout.session.completed event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            
            # Extract user information
            customer_email = session.get('customer_email')
            customer_id = session.get('customer')
            session_id = session.get('id')
            
            # Use customer email as user_id (or customer_id if no email)
            user_id = customer_email or customer_id or session_id
            
            # Get the pricing tier from metadata
            metadata = session.get('metadata', {})
            tier = metadata.get('tier', 'singularity')
            
            logger.info(f"💰 Payment successful for user: {user_id}, tier: {tier}")
            
            # Get tier configuration
            tier_config = PRICING_TIERS.get(tier, PRICING_TIERS['singularity'])
            
            # Mint credits in Rust Economy module
            try:
                mint_result = mint_credits_in_rust(user_id, tier_config['credits'])
                logger.info(f"✅ Credits minted: {mint_result}")
                
                # Unlock modules
                unlock_results = unlock_modules_in_rust(user_id, tier_config['modules'])
                logger.info(f"🔓 Modules unlocked: {unlock_results}")
                
                return jsonify({
                    "success": True,
                    "message": "Credits minted and modules unlocked",
                    "user_id": user_id,
                    "credits": tier_config['credits'],
                    "mint_result": mint_result,
                    "unlock_results": unlock_results
                }), 200
                
            except Exception as e:
                logger.error(f"❌ Failed to process payment in economy module: {e}")
                return jsonify({
                    "success": False,
                    "error": "Failed to mint credits",
                    "details": str(e)
                }), 500

        # Handle other event types
        elif event['type'] == 'payment_intent.succeeded':
            logger.info("💳 Payment intent succeeded")
        elif event['type'] == 'customer.subscription.created':
            logger.info("🔄 Subscription created")
        elif event['type'] == 'customer.subscription.deleted':
            logger.info("❌ Subscription cancelled")
        
        return jsonify({"success": True}), 200

    except ValueError as e:
        logger.error(f"Invalid payload: {e}")
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {e}")
        return jsonify({"error": "Invalid signature"}), 400
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/webhook/test', methods=['POST'])
def test_webhook():
    """
    Test endpoint for simulating successful payments without Stripe.
    """
    data = request.json
    user_id = data.get('user_id', 'test_user@example.com')
    tier = data.get('tier', 'singularity')
    
    tier_config = PRICING_TIERS.get(tier, PRICING_TIERS['singularity'])
    
    try:
        mint_result = mint_credits_in_rust(user_id, tier_config['credits'])
        unlock_results = unlock_modules_in_rust(user_id, tier_config['modules'])
        
        return jsonify({
            "success": True,
            "message": "Test payment processed",
            "user_id": user_id,
            "tier": tier,
            "credits": tier_config['credits'],
            "mint_result": mint_result,
            "unlock_results": unlock_results
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "stripe_webhook_handler",
        "rust_economy_url": RUST_ECONOMY_URL
    }), 200

if __name__ == "__main__":
    logger.info("🚀 Starting Stripe Webhook Handler (Wealth Bridge)")
    logger.info(f"📡 Rust Economy URL: {RUST_ECONOMY_URL}")
    app.run(host='0.0.0.0', port=5051, debug=False)
