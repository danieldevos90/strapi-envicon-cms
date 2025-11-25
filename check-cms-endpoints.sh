#!/bin/bash

# Check all CMS endpoints
STRAPI_URL="https://cms.envicon.nl"

echo "🔍 Checking CMS Endpoints"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_endpoint() {
    local endpoint=$1
    local name=$2
    local response=$(curl -s -o /dev/null -w "%{http_code}" "${STRAPI_URL}${endpoint}")
    local status=""
    
    if [ "$response" = "200" ]; then
        status="✅"
    elif [ "$response" = "404" ]; then
        status="❌"
    elif [ "$response" = "204" ]; then
        status="✅ (No Content)"
    else
        status="⚠️"
    fi
    
    printf "%-30s %s HTTP %s\n" "$name:" "$status" "$response"
}

check_endpoint "/" "Root URL"
check_endpoint "/_health" "Health Check"
check_endpoint "/admin" "Admin Panel"
check_endpoint "/api/articles" "API Articles"
check_endpoint "/api/navigation" "API Navigation"
check_endpoint "/api/homepage" "API Homepage"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test root URL content
echo "Root URL Response:"
ROOT_RESPONSE=$(curl -s "${STRAPI_URL}/" 2>&1)
if [ -z "$ROOT_RESPONSE" ]; then
    echo "  (Empty response)"
else
    echo "$ROOT_RESPONSE" | head -10
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Strapi is running
echo "Strapi Status Check:"
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "${STRAPI_URL}/_health")
if [ "$HEALTH" = "200" ] || [ "$HEALTH" = "204" ]; then
    echo "✅ Strapi appears to be running"
else
    echo "❌ Strapi health check failed (HTTP $HEALTH)"
    echo ""
    echo "Possible issues:"
    echo "  - Strapi is not running"
    echo "  - Strapi needs to be restarted"
    echo "  - Check Plesk Node.js application status"
    echo "  - Check Strapi logs for errors"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

