#!/bin/bash
# DEPLOYMENT SCRIPT FOR RENDER (CLI)

echo "🚀 Initiating Veritas QA Framework Deployment..."

# 1. Check for Render CLI
if ! command -v render &> /dev/null
then
    echo "❌ Render CLI could not be found. Please install it."
    exit 1
fi

# 2. Authenticate
# echo "🔑 Authenticating..."
# render auth login

# 3. Deploy using Blueprint
echo "📜 Reading render.yaml Blueprint..."
render blueprint deploy --path render.yaml

echo "✅ Deployment Triggered!"
echo "   - Backend: Building Docker Image..."
echo "   - Frontend: Compiling React/Vite..."
echo "   - Monitor status at: https://dashboard.render.com/"
