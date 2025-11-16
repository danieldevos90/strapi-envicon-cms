#!/bin/bash

# Debug script for article using curl
# Usage: ./debug-article-curl.sh [ARTICLE_ID] [API_TOKEN]

ARTICLE_ID="${1:-pije4nqe569muxg23nhulp6y}"
API_TOKEN="${2:-}"
STRAPI_URL="https://cms.envicon.nl"

echo "🔍 Debugging Article: $ARTICLE_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Check Strapi health
echo "1️⃣ Testing Strapi connectivity..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${STRAPI_URL}/_health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Strapi is accessible"
else
    echo "❌ Strapi health check failed: HTTP $HEALTH_RESPONSE"
fi
echo ""

# Test 2: Get article without auth (public)
echo "2️⃣ Testing article endpoint (public access)..."
ARTICLE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${STRAPI_URL}/api/articles/${ARTICLE_ID}?populate=*")
HTTP_CODE=$(echo "$ARTICLE_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$ARTICLE_RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Article found via public API"
    echo ""
    echo "Article Data:"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    
    # Extract key fields
    TITLE=$(echo "$BODY" | grep -o '"title":"[^"]*"' | head -1 | cut -d'"' -f4)
    SLUG=$(echo "$BODY" | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
    PUBLISHED=$(echo "$BODY" | grep -o '"publishedAt":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    echo ""
    echo "Key Fields:"
    echo "  Title: ${TITLE:-Not found}"
    echo "  Slug: ${SLUG:-Not found}"
    echo "  Published At: ${PUBLISHED:-Not published}"
else
    echo "❌ Failed to fetch article: HTTP $HTTP_CODE"
    echo ""
    echo "Response:"
    echo "$BODY"
fi
echo ""

# Test 3: Get article with auth (if token provided)
if [ -n "$API_TOKEN" ]; then
    echo "3️⃣ Testing article endpoint (with authentication)..."
    AUTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
        -H "Authorization: Bearer $API_TOKEN" \
        "${STRAPI_URL}/api/articles/${ARTICLE_ID}?populate=*")
    AUTH_HTTP_CODE=$(echo "$AUTH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
    AUTH_BODY=$(echo "$AUTH_RESPONSE" | sed '/HTTP_CODE/d')
    
    if [ "$AUTH_HTTP_CODE" = "200" ]; then
        echo "✅ Article found via authenticated API"
        echo ""
        echo "Article Data:"
        echo "$AUTH_BODY" | python3 -m json.tool 2>/dev/null || echo "$AUTH_BODY"
    else
        echo "❌ Failed to fetch article with auth: HTTP $AUTH_HTTP_CODE"
        echo ""
        echo "Response:"
        echo "$AUTH_BODY"
    fi
    echo ""
    
    # Test 4: Try to publish (if not published)
    echo "4️⃣ Testing publish action..."
    PUBLISH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
        -X POST \
        -H "Authorization: Bearer $API_TOKEN" \
        -H "Content-Type: application/json" \
        "${STRAPI_URL}/api/articles/${ARTICLE_ID}/actions/publish")
    PUBLISH_HTTP_CODE=$(echo "$PUBLISH_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
    PUBLISH_BODY=$(echo "$PUBLISH_RESPONSE" | sed '/HTTP_CODE/d')
    
    if [ "$PUBLISH_HTTP_CODE" = "200" ]; then
        echo "✅ Publish action succeeded!"
    else
        echo "❌ Publish action failed: HTTP $PUBLISH_HTTP_CODE"
        echo ""
        echo "Error Response:"
        echo "$PUBLISH_BODY" | python3 -m json.tool 2>/dev/null || echo "$PUBLISH_BODY"
    fi
    echo ""
else
    echo "3️⃣ Skipping authenticated tests (no API token provided)"
    echo "   To test with auth, run: ./debug-article-curl.sh $ARTICLE_ID YOUR_TOKEN"
    echo ""
fi

# Test 5: Check for duplicate slugs
if [ -n "$SLUG" ] && [ -n "$API_TOKEN" ]; then
    echo "5️⃣ Checking for duplicate slugs..."
    DUPLICATE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
        -H "Authorization: Bearer $API_TOKEN" \
        "${STRAPI_URL}/api/articles?filters[slug][\$eq]=${SLUG}&pagination[limit]=10")
    DUPLICATE_HTTP_CODE=$(echo "$DUPLICATE_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
    DUPLICATE_BODY=$(echo "$DUPLICATE_RESPONSE" | sed '/HTTP_CODE/d')
    
    if [ "$DUPLICATE_HTTP_CODE" = "200" ]; then
        COUNT=$(echo "$DUPLICATE_BODY" | grep -o '"id":"[^"]*"' | wc -l | tr -d ' ')
        if [ "$COUNT" -le 1 ]; then
            echo "✅ Slug is unique"
        else
            echo "⚠️  Found $COUNT articles with slug '$SLUG' (duplicate detected)"
        fi
    fi
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Summary:"
echo "  Article ID: $ARTICLE_ID"
echo "  Strapi URL: $STRAPI_URL"
if [ -n "$API_TOKEN" ]; then
    echo "  API Token: Provided"
else
    echo "  API Token: Not provided (limited testing)"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

