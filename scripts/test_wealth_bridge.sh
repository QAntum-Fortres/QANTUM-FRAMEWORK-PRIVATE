#!/bin/bash

# Wealth Bridge - Integration Test Script
# Tests all components of the Wealth Bridge system

set -e

echo "🧪 Running Wealth Bridge Integration Tests"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=${4:-}
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ] && [ ! -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" "$url")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
        echo "   Response: $body"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo "1. Testing Rust Economy Server"
echo "--------------------------------"
test_endpoint "Health Check" "http://localhost:8890/health"
test_endpoint "Telemetry API" "http://localhost:8890/api/telemetry"
test_endpoint "Balances API" "http://localhost:8890/api/balances"
echo ""

echo "2. Testing Stripe Webhook Handler"
echo "----------------------------------"
test_endpoint "Health Check" "http://localhost:5051/health"
test_endpoint "Test Webhook (Mock Payment)" "http://localhost:5051/webhook/test" "POST" \
    '{"user_id":"integration_test@example.com","tier":"singularity"}'
echo ""

echo "3. Testing SEO Audit Module"
echo "----------------------------"
test_endpoint "Health Check" "http://localhost:8091/health"
test_endpoint "SEO Audit" "http://localhost:8091/api/audit" "POST" \
    '{"url":"https://example.com"}'
echo ""

echo "4. Verifying Credit Minting"
echo "----------------------------"
echo -n "Checking user balance after mock payment... "
response=$(curl -s "http://localhost:8890/api/balance?user_id=integration_test@example.com")

if echo "$response" | grep -q '"credits"'; then
    credits=$(echo "$response" | grep -o '"credits":[0-9.]*' | cut -d':' -f2)
    if [ ! -z "$credits" ] && [ $(echo "$credits > 0" | bc -l) -eq 1 ]; then
        echo -e "${GREEN}✓ PASS${NC} (Credits: $credits)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (No credits found)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo -e "${RED}✗ FAIL${NC} (Invalid response)"
    echo "   Response: $response"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

echo "5. Testing Frontend Build"
echo "-------------------------"
echo -n "Checking if Frontend is accessible... "
if curl -s "http://localhost:5173" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "${RED}✗ FAIL${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

echo "==========================================="
echo "Test Results:"
echo "  Passed: $TESTS_PASSED"
echo "  Failed: $TESTS_FAILED"
echo "==========================================="

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
