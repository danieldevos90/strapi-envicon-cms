#!/bin/bash

# Test article creation with verbose error output
API_TOKEN="2ec4867ccf501bf9a1ae5361091007c9a1027c9f04fa8db31a5bdef0a59fe495e17a0d1caef7607b072b69d794b37a8997ac9ff06bf607db3f19c0bdb6f885a9b7cc1afb0ed37fc87d3f5773a918d8672be66b4f573ec1ff623255600fb8003885f64112d3e7648fb11aac3784aa5544a6fb896082c4523fe1a3036739060b3a"
STRAPI_URL="https://cms.envicon.nl"
TIMESTAMP=$(date +%s)

echo "🔍 Testing Article Creation with Verbose Output"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will show the full response including any error details"
echo ""

CREATE_DATA=$(cat <<EOF
{
  "data": {
    "title": "Test Verbose $TIMESTAMP",
    "slug": "test-verbose-$TIMESTAMP",
    "excerpt": "Test excerpt for verbose error",
    "content": "<p>Test content</p>"
  }
}
EOF
)

echo "Request:"
echo "$CREATE_DATA" | python3 -m json.tool
echo ""

echo "Sending request..."
echo ""

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}\nHTTP_MESSAGE:%{http_code}\n" \
  -X POST \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$CREATE_DATA" \
  "${STRAPI_URL}/api/articles" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "HTTP Status: $HTTP_CODE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Full Response:"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "500" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ 500 Error - Check Strapi logs for details:"
    echo ""
    echo "1. Plesk → Logs → Error Log"
    echo "2. Look for errors around $(date '+%H:%M:%S')"
    echo "3. Copy the exact error message"
    echo ""
    echo "The error will show what's failing!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

