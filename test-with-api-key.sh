#!/bin/bash

# Test article with API key
API_TOKEN="2ec4867ccf501bf9a1ae5361091007c9a1027c9f04fa8db31a5bdef0a59fe495e17a0d1caef7607b072b69d794b37a8997ac9ff06bf607db3f19c0bdb6f885a9b7cc1afb0ed37fc87d3f5773a918d8672be66b4f573ec1ff623255600fb8003885f64112d3e7648fb11aac3784aa5544a6fb896082c4523fe1a3036739060b3a"
ARTICLE_ID="${1:-pije4nqe569muxg23nhulp6y}"
STRAPI_URL="https://cms.envicon.nl"

echo "🔍 Testing Article: $ARTICLE_ID with API Key"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Get article
echo "1️⃣ Fetching article..."
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
  -H "Authorization: Bearer $API_TOKEN" \
  "${STRAPI_URL}/api/articles/${ARTICLE_ID}?populate=*")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP_CODE"
echo ""
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Article found!"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    
    # Extract key info
    TITLE=$(echo "$BODY" | grep -o '"title":"[^"]*"' | head -1 | cut -d'"' -f4)
    SLUG=$(echo "$BODY" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
    PUBLISHED=$(echo "$BODY" | grep -o '"publishedAt":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    echo ""
    echo "Article Details:"
    echo "  Title: ${TITLE:-N/A}"
    echo "  Slug: ${SLUG:-N/A}"
    echo "  Published: ${PUBLISHED:-Not published (draft)}"
else
    echo "❌ Article not found (HTTP $HTTP_CODE)"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
fi
echo ""

# Test 2: Try publish action
if [ "$HTTP_CODE" = "200" ]; then
    echo "2️⃣ Testing publish action..."
    PUBLISH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
      -X POST \
      -H "Authorization: Bearer $API_TOKEN" \
      -H "Content-Type: application/json" \
      "${STRAPI_URL}/api/articles/${ARTICLE_ID}/actions/publish")
    PUBLISH_HTTP_CODE=$(echo "$PUBLISH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
    PUBLISH_BODY=$(echo "$PUBLISH_RESPONSE" | sed '/HTTP_CODE/d')
    
    echo "HTTP Status: $PUBLISH_HTTP_CODE"
    if [ "$PUBLISH_HTTP_CODE" = "200" ]; then
        echo "✅ Publish successful!"
        echo "$PUBLISH_BODY" | python3 -m json.tool 2>/dev/null || echo "$PUBLISH_BODY"
    else
        echo "❌ Publish failed!"
        echo "$PUBLISH_BODY" | python3 -m json.tool 2>/dev/null || echo "$PUBLISH_BODY"
    fi
    echo ""
fi

# Test 3: List recent articles
echo "3️⃣ Listing recent articles..."
LIST_RESPONSE=$(curl -s \
  -H "Authorization: Bearer $API_TOKEN" \
  "${STRAPI_URL}/api/articles?pagination[limit]=5&sort=createdAt:desc")
echo "$LIST_RESPONSE" | python3 -m json.tool 2>/dev/null | grep -E "(id|title|slug|publishedAt)" | head -20
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary:"
echo "  Article ID: $ARTICLE_ID"
echo "  Status: HTTP $HTTP_CODE"
if [ "$HTTP_CODE" = "404" ]; then
    echo ""
    echo "⚠️  Article does not exist in the database"
    echo "   - Check if the article ID is correct"
    echo "   - Article may have been deleted"
    echo "   - Try creating a new article"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

