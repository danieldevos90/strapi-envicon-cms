#!/bin/bash

# Quick debug for article pije4nqe569muxg23nhulp6y
ARTICLE_ID="pije4nqe569muxg23nhulp6y"
STRAPI_URL="https://cms.envicon.nl"

echo "🔍 Debugging Article: $ARTICLE_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Public access
echo "1️⃣ Testing public access..."
RESPONSE=$(curl -s "https://cms.envicon.nl/api/articles/${ARTICLE_ID}?populate=*")
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# Test 2: Check if it's in the articles list
echo "2️⃣ Checking if article exists in articles list..."
LIST_RESPONSE=$(curl -s "https://cms.envicon.nl/api/articles?pagination[limit]=100")
if echo "$LIST_RESPONSE" | grep -q "$ARTICLE_ID"; then
    echo "✅ Article ID found in articles list"
    echo "$LIST_RESPONSE" | python3 -m json.tool 2>/dev/null | grep -A 10 -B 10 "$ARTICLE_ID" | head -30
else
    echo "❌ Article ID NOT found in articles list"
    echo ""
    echo "Available articles (first 5):"
    echo "$LIST_RESPONSE" | python3 -m json.tool 2>/dev/null | grep -E "(id|title|slug)" | head -15
fi
echo ""

# Test 3: Check Strapi health
echo "3️⃣ Testing Strapi connectivity..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "${STRAPI_URL}/_health")
if [ "$HEALTH" = "200" ]; then
    echo "✅ Strapi is accessible"
else
    echo "❌ Strapi health check failed: HTTP $HEALTH"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary:"
echo "  Article ID: $ARTICLE_ID"
echo "  Status: $(echo "$RESPONSE" | grep -o '"status":[0-9]*' | cut -d: -f2 || echo 'Unknown')"
echo ""
echo "💡 If you see 404:"
echo "   - Article might be a draft (try with API token)"
echo "   - Article might not exist"
echo "   - Article might have been deleted"
echo ""
echo "💡 To test with authentication:"
echo "   curl -H \"Authorization: Bearer YOUR_TOKEN\" \\"
echo "     \"${STRAPI_URL}/api/articles/${ARTICLE_ID}\""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

