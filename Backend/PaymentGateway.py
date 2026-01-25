import os
import stripe
import logging

class PaymentGateway:
    def __init__(self):
        self.stripe_key = os.environ.get("STRIPE_SECRET_KEY")
        if self.stripe_key:
            stripe.api_key = self.stripe_key
            self.provider = "STRIPE"
        else:
            self.provider = "MOCK_LOGOS_LEDGER"
            print("[PAYMENT] No STRIPE_SECRET_KEY found. Using Mock Ledger.")

    def create_payment_intent(self, amount_usd: float, currency: str = "usd"):
        """
        Creates a payment intent (Stripe) or a mock transaction.
        """
        try:
            if self.provider == "STRIPE":
                intent = stripe.PaymentIntent.create(
                    amount=int(amount_usd * 100), # cents
                    currency=currency,
                    metadata={"integration_check": "accept_a_payment"}
                )
                return {"success": True, "client_secret": intent.client_secret, "id": intent.id}
            else:
                # Mock Response for Dev/Demo
                import uuid
                return {
                    "success": True, 
                    "client_secret": f"mock_secret_{uuid.uuid4()}", 
                    "id": f"mock_tx_{uuid.uuid4()}",
                    "message": "Payment Simulated (Zero-Cost Mode)"
                }
        except Exception as e:
            logging.error(f"Payment Error: {e}")
            return {"success": False, "error": str(e)}

    def confirm_transaction(self, tx_id: str):
        if self.provider == "STRIPE":
            # In a real app, rely on Webhooks, but here's a manual check
            intent = stripe.PaymentIntent.retrieve(tx_id)
            return intent.status
        return "succeeded"

<<<<<<< HEAD
    def create_checkout_session(self, price_id: str, success_url: str, cancel_url: str, mode: str = "payment", metadata: dict = None, customer_email: str = None):
=======
    def get_price_mapping(self):
>>>>>>> bb1e42f (MANIFEST: HELIOS Master Control Dashboard with Rust Telemetry Bridge)
        """
        Returns the mapping of Tiers to Stripe Price IDs.
        """
        return {
            "singularity": os.environ.get("STRIPE_PRICE_SINGULARITY", "price_1Q_SINGULARITY"),
            "aeterna": os.environ.get("STRIPE_PRICE_AETERNA", "price_1Q_AETERNA"),
            "vortex": os.environ.get("STRIPE_PRICE_VORTEX", "price_1Q_VORTEX")
        }

    def create_checkout_session(self, tier: str, success_url: str, cancel_url: str):
        """
        Creates a hosted Checkout Session for the specified tier.
        """
        try:
            price_map = self.get_price_mapping()
            price_id = price_map.get(tier.lower(), price_map["singularity"])
            
            if self.provider == "STRIPE":
<<<<<<< HEAD
                session_params = {
                    'payment_method_types': ['card'],
                    'line_items': [{
                        'price': price_id,  # e.g. price_1Hh1...
                        'quantity': 1,
                    }],
                    'mode': mode,
                    'success_url': success_url,
                    'cancel_url': cancel_url,
                }
                
                if metadata:
                    session_params['metadata'] = metadata
                
                if customer_email:
                    session_params['customer_email'] = customer_email
                
                session = stripe.checkout.Session.create(**session_params)
=======
                session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[{
                        'price': price_id,
                        'quantity': 1,
                    }],
                    mode='subscription',
                    success_url=success_url,
                    cancel_url=cancel_url,
                    metadata={"tier": tier}
                )
>>>>>>> bb1e42f (MANIFEST: HELIOS Master Control Dashboard with Rust Telemetry Bridge)
                return {"success": True, "url": session.url, "id": session.id}
            else:
                return {
                    "success": True, 
                    "url": f"https://example.com/mock-checkout?tier={tier}&status=success", 
                    "id": f"mock_sess_{os.urandom(4).hex()}",
                    "message": f"Checkout Session Simulated for Tier: {tier.upper()}"
                }
        except Exception as e:
            logging.error(f"Checkout Error: {e}")
            return {"success": False, "error": str(e)}
