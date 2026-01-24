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
