#!/bin/bash

# Test creating article with minimal required fields only
API_TOKEN="2ec4867ccf501bf9a1ae5361091007c9a1027c9f04fa8db31a5bdef0a59fe495e17a0d1caef7607b072b69d794b37a8997ac9ff06bf607db3f19c0bdb6f885a9b7cc1afb0ed37fc87d3f5773a918d8672be66b4f573ec1ff623255600fb8003885f64112d3e7648fb11aac3784aa5544a6fb896082c4523fe1a3036739060b3a"
STRAPI_URL="https://cms.envicon.nl"
TIMESTAMP=$(date +%s)

echo "🔍 Testing Article Creation with Minimal Fields"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# According to schema, required fields are:
# - title (string, required)
# - slug (uid, required) 
# - excerpt (text, required)
# - content (richtext, required)
# - publishedAt (date, required) - but this should be set on publish

echo "Test 1: Create article WITHOUT publishedAt (should be draft)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
CREATE_DATA1=$(cat <<EOF
{
  "data": {
    "title": "Test Minimal $TIMESTAMP",
    "slug": "test-minimal-$TIMESTAMP",
    "excerpt": "Test excerpt",
    "content": "<p>Test</p>"
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

HTTP_CODE1=$(echo "$RESPONSE1" | grep "HTTP_CODE" | cut -d: -f2)
BODY1=$(echo "$RESPONSE1" | sed '/HTTP_CODE/d')

echo "Response HTTP: $HTTP_CODE1"
echo "Response Body:"
echo "$BODY1" | python3 -m json.tool 2>/dev/null || echo "$BODY1"
echo ""

if [ "$HTTP_CODE1" = "200" ]; then
    ARTICLE_ID=$(echo "$BODY1" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "$BODY1" | grep -o '"documentId":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "✅ Article created! ID: $ARTICLE_ID"
    echo ""
    
    echo "Test 2: Try to publish..."
    PUBLISH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
      -X POST \
      -H "Authorization: Bearer $API_TOKEN" \
      -H "Content-Type: application/json" \
      "${STRAPI_URL}/api/articles/${ARTICLE_ID}/actions/publish")
    
    PUBLISH_HTTP=$(echo "$PUBLISH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
    PUBLISH_BODY=$(echo "$PUBLISH_RESPONSE" | sed '/HTTP_CODE/d')
    
    echo "Publish HTTP: $PUBLISH_HTTP"
    echo "$PUBLISH_BODY" | python3 -m json.tool 2>/dev/null || echo "$PUBLISH_BODY"
    
    # Cleanup
    curl -s -X DELETE \
      -H "Authorization: Bearer $API_TOKEN" \
      "${STRAPI_URL}/api/articles/${ARTICLE_ID}" > /dev/null
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 If both create and publish fail with 500:"
echo "   - Check Strapi server logs for detailed error"
echo "   - Verify database connection"
echo "   - Check article schema configuration"
echo "   - Verify all required fields are properly configured"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

