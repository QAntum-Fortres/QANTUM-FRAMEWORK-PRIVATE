"""
SEO Audit API Server
====================
Flask API server for the SEO Audit Micro-SaaS module.
"""

from flask import Flask, request, jsonify
from seo_auditor import run_audit
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "seo-audit-module"}), 200

@app.route('/api/audit', methods=['POST'])
def audit():
    """
    Run SEO audit on a URL.
    Expected JSON: { "url": "https://example.com" }
    """
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({"error": "URL is required"}), 400
        
        # Run audit
        results = run_audit(url)
        
        return jsonify(results), 200
        
    except Exception as e:
        logging.error(f"Audit error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/batch-audit', methods=['POST'])
def batch_audit():
    """
    Run SEO audit on multiple URLs.
    Expected JSON: { "urls": ["https://example1.com", "https://example2.com"] }
    """
    try:
        data = request.json
        urls = data.get('urls', [])
        
        if not urls:
            return jsonify({"error": "URLs array is required"}), 400
        
        results = []
        for url in urls:
            try:
                audit_result = run_audit(url)
                results.append(audit_result)
            except Exception as e:
                results.append({
                    "url": url,
                    "error": str(e)
                })
        
        return jsonify({
            "total": len(urls),
            "results": results
        }), 200
        
    except Exception as e:
        logging.error(f"Batch audit error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 SEO Audit Micro-SaaS Module starting on port 8091")
    app.run(host='0.0.0.0', port=8091, debug=False)
