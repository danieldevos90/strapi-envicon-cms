#!/bin/bash

# Simple article test with detailed error output
API_TOKEN="2ec4867ccf501bf9a1ae5361091007c9a1027c9f04fa8db31a5bdef0a59fe495e17a0d1caef7607b072b69d794b37a8997ac9ff06bf607db3f19c0bdb6f885a9b7cc1afb0ed37fc87d3f5773a918d8672be66b4f573ec1ff623255600fb8003885f64112d3e7648fb11aac3784aa5544a6fb896082c4523fe1a3036739060b3a"
STRAPI_URL="https://cms.envicon.nl"
TIMESTAMP=$(date +%s)

echo "🔍 Simple Article API Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: List existing articles
echo "1️⃣ Listing existing articles..."
LIST_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -H "Authorization: Bearer $API_TOKEN" \
  "${STRAPI_URL}/api/articles?pagination[limit]=3")
LIST_HTTP=$(echo "$LIST_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
LIST_BODY=$(echo "$LIST_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $LIST_HTTP"
if [ "$LIST_HTTP" = "200" ]; then
    echo "✅ Articles list works"
    ARTICLE_COUNT=$(echo "$LIST_BODY" | grep -o '"id":"[^"]*"' | wc -l | tr -d ' ')
    echo "Found $ARTICLE_COUNT articles"
    if [ "$ARTICLE_COUNT" -gt 0 ]; then
        echo ""
        echo "First article:"
        echo "$LIST_BODY" | python3 -m json.tool 2>/dev/null | head -30
    fi
else
    echo "❌ Failed to list articles"
    echo "$LIST_BODY" | python3 -m json.tool 2>/dev/null || echo "$LIST_BODY"
fi
echo ""

# Test 2: Create article with all fields
echo "2️⃣ Creating article with all fields..."
CREATE_DATA=$(cat <<EOF
{
  "data": {
    "title": "API Test Article $TIMESTAMP",
    "slug": "api-test-$TIMESTAMP",
    "excerpt": "This is a test article created via API",
    "content": "<p>Test content for API article creation.</p>",
    "author": "API Test",
    "category": "Test"
  }
}
EOF
)

CREATE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -X POST \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CREATE_DATA" \
  "${STRAPI_URL}/api/articles")

CREATE_HTTP=$(echo "$CREATE_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
CREATE_BODY=$(echo "$CREATE_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $CREATE_HTTP"
echo "Response:"
echo "$CREATE_BODY" | python3 -m json.tool 2>/dev/null || echo "$CREATE_BODY"

if [ "$CREATE_HTTP" = "200" ]; then
    ARTICLE_ID=$(echo "$CREATE_BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "$CREATE_BODY" | grep -o '"documentId":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$ARTICLE_ID" ]; then
        echo ""
        echo "✅ Article created! ID: $ARTICLE_ID"
        echo ""
        
        # Test 3: Publish
        echo "3️⃣ Testing publish..."
        PUBLISH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
          -X POST \
          -H "Authorization: Bearer $API_TOKEN" \
          -H "Content-Type: application/json" \
          "${STRAPI_URL}/api/articles/${ARTICLE_ID}/actions/publish")
        
        PUBLISH_HTTP=$(echo "$PUBLISH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
        PUBLISH_BODY=$(echo "$PUBLISH_RESPONSE" | sed '/HTTP_CODE/d')
        
        echo "HTTP Status: $PUBLISH_HTTP"
        if [ "$PUBLISH_HTTP" = "200" ]; then
            echo "✅ Publish successful!"
            echo "$PUBLISH_BODY" | python3 -m json.tool 2>/dev/null || echo "$PUBLISH_BODY"
        else
            echo "❌ Publish failed"
            echo "$PUBLISH_BODY" | python3 -m json.tool 2>/dev/null || echo "$PUBLISH_BODY"
        fi
        
        # Cleanup
        echo ""
        echo "4️⃣ Cleaning up..."
        curl -s -X DELETE \
          -H "Authorization: Bearer $API_TOKEN" \
          "${STRAPI_URL}/api/articles/${ARTICLE_ID}" > /dev/null
        echo "Test article deleted"
    fi
else
    echo ""
    echo "❌ Article creation failed"
    echo ""
    echo "Possible issues:"
    echo "  - Schema validation error"
    echo "  - Database connection issue"
    echo "  - Missing required fields"
    echo "  - Strapi needs rebuild after schema changes"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

