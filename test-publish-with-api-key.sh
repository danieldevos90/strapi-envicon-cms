#!/bin/bash

# Test creating and publishing an article to debug publish 500 error
API_TOKEN="2ec4867ccf501bf9a1ae5361091007c9a1027c9f04fa8db31a5bdef0a59fe495e17a0d1caef7607b072b69d794b37a8997ac9ff06bf607db3f19c0bdb6f885a9b7cc1afb0ed37fc87d3f5773a918d8672be66b4f573ec1ff623255600fb8003885f64112d3e7648fb11aac3784aa5544a6fb896082c4523fe1a3036739060b3a"
STRAPI_URL="https://cms.envicon.nl"
TIMESTAMP=$(date +%s)

echo "🔍 Testing Article Create and Publish (Debug 500 Error)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Create a test article
echo "1️⃣ Creating test article..."
CREATE_DATA=$(cat <<EOF
{
  "data": {
    "title": "Test Article Debug $TIMESTAMP",
    "slug": "test-article-debug-$TIMESTAMP",
    "excerpt": "This is a test article for debugging publish issues",
    "content": "<p>Test content for debugging</p>",
    "author": "Debug Script",
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

CREATE_HTTP_CODE=$(echo "$CREATE_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
CREATE_BODY=$(echo "$CREATE_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $CREATE_HTTP_CODE"
if [ "$CREATE_HTTP_CODE" = "200" ]; then
    echo "✅ Article created successfully!"
    echo "$CREATE_BODY" | python3 -m json.tool 2>/dev/null || echo "$CREATE_BODY"
    
    # Extract article ID
    ARTICLE_ID=$(echo "$CREATE_BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "$CREATE_BODY" | grep -o '"documentId":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$ARTICLE_ID" ]; then
        echo ""
        echo "Article ID: $ARTICLE_ID"
        echo ""
        
        # Test 2: Try to publish
        echo "2️⃣ Testing publish action..."
        PUBLISH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
          -X POST \
          -H "Authorization: Bearer $API_TOKEN" \
          -H "Content-Type: application/json" \
          "${STRAPI_URL}/api/articles/${ARTICLE_ID}/actions/publish")
        
        PUBLISH_HTTP_CODE=$(echo "$PUBLISH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
        PUBLISH_BODY=$(echo "$PUBLISH_RESPONSE" | sed '/HTTP_CODE/d')
        
        echo "HTTP Status: $PUBLISH_HTTP_CODE"
        echo ""
        if [ "$PUBLISH_HTTP_CODE" = "200" ]; then
            echo "✅ Publish successful!"
            echo "$PUBLISH_BODY" | python3 -m json.tool 2>/dev/null || echo "$PUBLISH_BODY"
        else
            echo "❌ Publish failed with HTTP $PUBLISH_HTTP_CODE"
            echo "This is the 500 error you're experiencing!"
            echo ""
            echo "Error Response:"
            echo "$PUBLISH_BODY" | python3 -m json.tool 2>/dev/null || echo "$PUBLISH_BODY"
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "🔍 Error Analysis:"
            echo "  Status: $PUBLISH_HTTP_CODE"
            echo "  Article ID: $ARTICLE_ID"
            echo ""
            echo "Common causes:"
            echo "  - Missing required field: publishedAt"
            echo "  - Database constraint violation"
            echo "  - Invalid data format"
            echo "  - Lifecycle hook error"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        fi
        
        # Cleanup: Delete test article
        echo ""
        echo "3️⃣ Cleaning up test article..."
        DELETE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
          -X DELETE \
          -H "Authorization: Bearer $API_TOKEN" \
          "${STRAPI_URL}/api/articles/${ARTICLE_ID}")
        DELETE_HTTP_CODE=$(echo "$DELETE_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
        if [ "$DELETE_HTTP_CODE" = "200" ]; then
            echo "✅ Test article deleted"
        else
            echo "⚠️  Could not delete test article (ID: $ARTICLE_ID)"
            echo "   You may need to delete it manually from Strapi admin"
        fi
    else
        echo "⚠️  Could not extract article ID from response"
    fi
else
    echo "❌ Article creation failed!"
    echo "$CREATE_BODY" | python3 -m json.tool 2>/dev/null || echo "$CREATE_BODY"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

