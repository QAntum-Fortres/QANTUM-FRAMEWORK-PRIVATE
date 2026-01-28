import sys
import os
import unittest

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PaymentGateway import PaymentGateway

class TestPaymentGateway(unittest.TestCase):
    def setUp(self):
        # Ensure we are in Mock mode for safety unless env is set
        if "STRIPE_SECRET_KEY" not in os.environ:
            print("Running Payment Tests in MOCK Mode")

    def test_gateway_init(self):
        pg = PaymentGateway()
        self.assertIsNotNone(pg)

    def test_create_payment_intent(self):
        pg = PaymentGateway()
        result = pg.create_payment_intent(100.00, "usd")
        self.assertTrue(result["success"])
        if pg.provider == "MOCK_LOGOS_LEDGER":
            self.assertIn("mock_secret", result["client_secret"])

    def test_create_checkout_session(self):
        pg = PaymentGateway()
        result = pg.create_checkout_session(
            tier="singularity",
            success_url="http://localhost:3000/success",
            cancel_url="http://localhost:3000/cancel"
        )
        self.assertTrue(result["success"])
        if pg.provider == "MOCK_LOGOS_LEDGER":
            self.assertIn("mock_sess", result["id"])

if __name__ == '__main__':
    unittest.main()
