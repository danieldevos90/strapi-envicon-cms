#!/bin/bash

# Fix ModSecurity for Strapi on Plesk
# This script adds Apache directives to disable problematic ModSecurity rules

echo "🔧 Fixing ModSecurity for Strapi..."

# Detect Plesk Apache config location
# Common locations:
CONFIG_LOCATIONS=(
    "/etc/apache2/conf.d/cms.envicon.nl.conf"
    "/var/www/vhosts/system/cms.envicon.nl/conf/vhost.conf"
    "/etc/apache2/plesk.conf.d/vhosts/cms.envicon.nl.conf"
)

CONFIG_FILE=""

# Find existing config file
for location in "${CONFIG_LOCATIONS[@]}"; do
    if [ -f "$location" ]; then
        CONFIG_FILE="$location"
        echo "✅ Found config: $CONFIG_FILE"
        break
    fi
done

# If not found, try to find any cms.envicon.nl config
if [ -z "$CONFIG_FILE" ]; then
    CONFIG_FILE=$(find /etc/apache2 -name "*cms.envicon.nl*" -type f 2>/dev/null | head -1)
    if [ -n "$CONFIG_FILE" ]; then
        echo "✅ Found config: $CONFIG_FILE"
    fi
fi

# If still not found, use default Plesk location
if [ -z "$CONFIG_FILE" ]; then
    CONFIG_FILE="/etc/apache2/conf.d/cms.envicon.nl.conf"
    echo "⚠️  Config not found, will create: $CONFIG_FILE"
fi

# Check if ModSecurity exception already exists
if grep -q "SecRuleRemoveById 211760" "$CONFIG_FILE" 2>/dev/null; then
    echo "✅ ModSecurity exception already exists"
    exit 0
fi

# Backup config
if [ -f "$CONFIG_FILE" ]; then
    BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo "✅ Backup created: $BACKUP_FILE"
fi

# Add ModSecurity exception
cat >> "$CONFIG_FILE" << 'EOF'

# Strapi ModSecurity Exception - Disable COMODO WAF rule 211760 for MongoDB operators
<IfModule mod_security2.c>
    <LocationMatch "^/(upload|api)">
        SecRuleRemoveById 211760
    </LocationMatch>
</IfModule>
EOF

echo "✅ ModSecurity configuration added to $CONFIG_FILE"
echo ""
echo "📝 Next steps:"
echo "1. Test Apache config: sudo apache2ctl configtest"
echo "2. Restart Apache: sudo systemctl restart apache2"
echo "3. Test Strapi upload: https://cms.envicon.nl/admin/plugins/upload"
echo ""

