#!/bin/bash
# Test script for Contest Tracker automation endpoints
# Make sure to set your CRON_SECRET environment variable first:
# export CRON_SECRET="your_secret_here"

BASE_URL="https://contest-tracker-gamma-rust.vercel.app"

echo "🧪 Testing Contest Tracker Automation Endpoints"
echo "================================================="

if [ -z "$CRON_SECRET" ]; then
    echo "❌ CRON_SECRET environment variable not set"
    echo "Please run: export CRON_SECRET=\"your_secret_here\""
    exit 1
fi

echo "🔗 Base URL: $BASE_URL"
echo "🔑 Using CRON_SECRET: ${CRON_SECRET:0:8}..."
echo ""

echo "1️⃣  Testing contest update endpoint..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/cron/update-contests" \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H "Content-Type: application/json")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "200" ]; then
    echo "✅ Contest update: SUCCESS ($http_code)"
    echo "   Response: $body" | head -c 100
    echo "..."
else
    echo "❌ Contest update: FAILED ($http_code)"
    echo "   Response: $body"
fi
echo ""

echo "2️⃣  Testing solution fetch endpoint..."
response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/api/cron/fetch-solutions" \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H "Content-Type: application/json")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "200" ]; then
    echo "✅ Solution fetch: SUCCESS ($http_code)"
    echo "   Response: $body" | head -c 100
    echo "..."
else
    echo "❌ Solution fetch: FAILED ($http_code)"
    echo "   Response: $body"
fi
echo ""

echo "3️⃣  Testing scheduler status endpoint..."
response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/api/cron/scheduler" \
    -H "Authorization: Bearer $CRON_SECRET")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "200" ]; then
    echo "✅ Scheduler status: SUCCESS ($http_code)"
    echo "   Response: $body"
else
    echo "❌ Scheduler status: FAILED ($http_code)"
    echo "   Response: $body"
fi
echo ""

echo "🎯 Test completed!"
echo ""
echo "Next steps:"
echo "- If all tests passed: Your automation is ready! ✅"
echo "- If tests failed: Check your CRON_SECRET and Vercel deployment"
echo "- Setup GitHub Actions using the workflows in .github/workflows/"
