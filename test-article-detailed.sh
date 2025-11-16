#!/bin/bash

# Detailed article test with verbose output
API_TOKEN="2ec4867ccf501bf9a1ae5361091007c9a1027c9f04fa8db31a5bdef0a59fe495e17a0d1caef7607b072b69d794b37a8997ac9ff06bf607db3f19c0bdb6f885a9b7cc1afb0ed37fc87d3f5773a918d8672be66b4f573ec1ff623255600fb8003885f64112d3e7648fb11aac3784aa5544a6fb896082c4523fe1a3036739060b3a"
STRAPI_URL="https://cms.envicon.nl"
TIMESTAMP=$(date +%s)

echo "🔍 Detailed Article API Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Check if we can read articles
echo "1️⃣ Testing GET /api/articles (read)..."
GET_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -H "Authorization: Bearer $API_TOKEN" \
  "${STRAPI_URL}/api/articles?pagination[limit]=1")
GET_HTTP=$(echo "$GET_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
GET_BODY=$(echo "$GET_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $GET_HTTP"
if [ "$GET_HTTP" = "200" ]; then
    echo "✅ Read works!"
    echo "$GET_BODY" | python3 -m json.tool 2>/dev/null | head -20
else
    echo "❌ Read failed"
    echo "$GET_BODY"
fi
echo ""

# Test 2: Try creating with explicit null publishedAt
echo "2️⃣ Creating article with explicit publishedAt: null..."
CREATE_DATA1=$(cat <<EOF
{
  "data": {
    "title": "Test Explicit Null $TIMESTAMP",
    "slug": "test-explicit-null-$TIMESTAMP",
    "excerpt": "Test excerpt",
    "content": "<p>Test</p>",
    "publishedAt": null
  }
}
EOF
)

echo "Request:"
echo "$CREATE_DATA1" | python3 -m json.tool
echo ""

RESPONSE1=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CREATE_DATA1" \
  "${STRAPI_URL}/api/articles")

HTTP1=$(echo "$RESPONSE1" | grep "HTTP_CODE" | cut -d: -f2)
BODY1=$(echo "$RESPONSE1" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP1"
echo "Response:"
echo "$BODY1" | python3 -m json.tool 2>/dev/null || echo "$BODY1"
echo ""

# Test 3: Try creating without publishedAt field at all
echo "3️⃣ Creating article without publishedAt field..."
CREATE_DATA2=$(cat <<EOF
{
  "data": {
    "title": "Test No Field $TIMESTAMP",
    "slug": "test-no-field-$TIMESTAMP",
    "excerpt": "Test excerpt",
    "content": "<p>Test</p>"
  }
}
EOF
)

RESPONSE2=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CREATE_DATA2" \
  "${STRAPI_URL}/api/articles")

HTTP2=$(echo "$RESPONSE2" | grep "HTTP_CODE" | cut -d: -f2)
BODY2=$(echo "$RESPONSE2" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP2"
echo "Response:"
echo "$BODY2" | python3 -m json.tool 2>/dev/null || echo "$BODY2"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary:"
echo "  GET articles: HTTP $GET_HTTP"
echo "  POST with null: HTTP $HTTP1"
echo "  POST without field: HTTP $HTTP2"
echo ""
if [ "$HTTP1" = "500" ] && [ "$HTTP2" = "500" ]; then
    echo "⚠️  Both creation methods fail with 500"
    echo ""
    echo "This suggests:"
    echo "  - Strapi may not have been rebuilt yet"
    echo "  - Database migration may be needed"
    echo "  - There may be another schema issue"
    echo "  - Check Strapi server logs for detailed error"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

