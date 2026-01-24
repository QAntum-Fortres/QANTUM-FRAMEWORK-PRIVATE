"""
OmniCore SCRIBE Integration
============================
Adds a REST endpoint to OmniCore for generating Sovereign certificates.
"""

import sys
import os

# Add backend directory to path
sys.path.append( os.path.join(os.path.dirname(__file__), 'backend'))

from Scribe import generate_certificate
from PaymentGateway import PaymentGateway
from flask import Flask, jsonify, request
import uuid

app = Flask(__name__)
payment_gw = PaymentGateway()

@app.route('/generate-certificate', methods=['POST'])
def create_certificate():
    """
    Endpoint for generating a Sovereign Truth Certificate.
    Returns: JSON with the PDF file path
    """
    try:
        session_id = str(uuid.uuid4())[:8]
        cert_path = generate_certificate(session_id=session_id)
        
        return jsonify({
            "success": True,
            "session_id": session_id,
            "certificate_path": cert_path,
            "message": "Certificate generated successfully"
        }), 200
    
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/pay', methods=['POST'])
def process_payment():
    """
    Endpoint to initiate a transaction (Stripe/Mock).
    Expected JSON: { "amount": 10.0, "currency": "usd" }
    """
    try:
        data = request.json
        amount = data.get('amount', 50.0) # Default $50
        currency = data.get('currency', 'usd')
        
        result = payment_gw.create_payment_intent(amount, currency)
        return jsonify(result), 200 if result['success'] else 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print("[OMNICORE-SCRIBE] Initializing certificate endpoint on port 5050...")
    app.run(host='0.0.0.0', port=5050, debug=False)
