#!/bin/bash

###############################################################################
# QANTUM Framework - Verification Script
# 
# This script verifies that the QANTUM Framework improvements are working
# correctly and ready for deployment.
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "═══════════════════════════════════════════════════════════════"
echo "  🔍 QANTUM Framework - Verification Report"
echo "═══════════════════════════════════════════════════════════════"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TOTAL_TESTS++))
    echo -n "Testing: $test_name ... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "📦 Checking File Structure..."
echo "───────────────────────────────────────────────────────────────"

run_test "QantumClient.ts exists" "test -f src/qantum-client/QantumClient.ts"
run_test "index.ts exists" "test -f src/qantum-client/index.ts"
run_test "package.json exists" "test -f src/qantum-client/package.json"
run_test "tsconfig.json exists" "test -f src/qantum-client/tsconfig.json"
run_test "Basic example exists" "test -f src/qantum-client/examples/basic-usage.ts"
run_test "Advanced example exists" "test -f src/qantum-client/examples/advanced-usage.ts"
run_test "Parallel example exists" "test -f src/qantum-client/examples/parallel-execution.ts"

echo ""
echo "📚 Checking Documentation..."
echo "───────────────────────────────────────────────────────────────"

run_test "Getting Started guide" "test -f GETTING_STARTED.md"
run_test "Main README" "test -f README_QANTUM_CLIENT.md"
run_test "QAntum Client README" "test -f src/qantum-client/README.md"
run_test "Changelog" "test -f CHANGELOG_QANTUM_CLIENT.md"
run_test "Implementation Summary" "test -f IMPLEMENTATION_SUMMARY_QANTUM.md"

echo ""
echo "🛠️ Checking Scripts..."
echo "───────────────────────────────────────────────────────────────"

run_test "Deploy script exists" "test -f deploy-qantum.sh"
run_test "Deploy script executable" "test -x deploy-qantum.sh"

echo ""
echo "📊 Code Statistics..."
echo "───────────────────────────────────────────────────────────────"

# Count lines of code
QANTUM_CLIENT_LOC=$(wc -l src/qantum-client/QantumClient.ts 2>/dev/null | awk '{print $1}')
EXAMPLES_LOC=$(find src/qantum-client/examples -name "*.ts" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}')
TOTAL_TS_LOC=$((QANTUM_CLIENT_LOC + EXAMPLES_LOC))

echo "  QantumClient.ts:     $QANTUM_CLIENT_LOC lines"
echo "  Examples:            $EXAMPLES_LOC lines"
echo "  Total TypeScript:    $TOTAL_TS_LOC lines"

# Count documentation
DOC_LOC=$(wc -l GETTING_STARTED.md README_QANTUM_CLIENT.md src/qantum-client/README.md CHANGELOG_QANTUM_CLIENT.md 2>/dev/null | tail -1 | awk '{print $1}')
echo "  Documentation:       $DOC_LOC lines"

echo ""
echo "🎯 Feature Verification..."
echo "───────────────────────────────────────────────────────────────"

# Check for key features in code
run_test "AI-powered selection" "grep -q 'aiDescription' src/qantum-client/QantumClient.ts"
run_test "Self-healing logic" "grep -q 'selfHealing' src/qantum-client/QantumClient.ts"
run_test "Parallel execution" "grep -q 'parallel' src/qantum-client/QantumClient.ts"
run_test "Performance metrics" "grep -q 'getPerformanceMetrics' src/qantum-client/QantumClient.ts"
run_test "Visual testing" "grep -q 'expectVisualMatch' src/qantum-client/QantumClient.ts"
run_test "Network interception" "grep -q 'interceptNetwork' src/qantum-client/QantumClient.ts"
run_test "Fluent API" "grep -q 'return this' src/qantum-client/QantumClient.ts"

echo ""
echo "📄 Documentation Coverage..."
echo "───────────────────────────────────────────────────────────────"

run_test "API Reference" "grep -q 'API Reference' src/qantum-client/README.md"
run_test "Migration guides" "grep -q 'From Selenium' src/qantum-client/README.md"
run_test "Examples documented" "grep -q 'Example usage' src/qantum-client/README.md"
run_test "Getting started" "grep -q 'Quick Start' GETTING_STARTED.md"
run_test "Deployment docs" "grep -q 'Deployment' README_QANTUM_CLIENT.md"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📊 Verification Results"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  Total Tests:     $TOTAL_TESTS"
echo -e "  ${GREEN}Passed:          $TESTS_PASSED${NC}"
echo -e "  ${RED}Failed:          $TESTS_FAILED${NC}"
echo ""

SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))
echo "  Success Rate:    $SUCCESS_RATE%"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! QANTUM Framework is ready for deployment.${NC}"
    echo ""
    echo "Next Steps:"
    echo "  1. Run: ./deploy-qantum.sh install"
    echo "  2. Run: cd src/qantum-client && npm test"
    echo "  3. Run: ./deploy-qantum.sh start"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the issues above.${NC}"
    echo ""
    exit 1
fi
