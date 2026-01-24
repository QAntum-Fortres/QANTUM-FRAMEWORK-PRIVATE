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
from flask import Flask, jsonify
import uuid

app = Flask(__name__)

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

if __name__ == "__main__":
    print("[OMNICORE-SCRIBE] Initializing certificate endpoint on port 5050...")
    app.run(host='0.0.0.0', port=5050, debug=False)
