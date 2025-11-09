#!/bin/bash

# 🚀 Production API Keys Setup Script
# Run this script to update all your API keys before launching

echo "🚀 SwipeWipe - Production Keys Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will help you update all API keys for production.${NC}"
echo -e "${YELLOW}Make sure you have all your keys ready!${NC}"
echo ""

# AdMob App ID
echo -e "${GREEN}1. AdMob App ID${NC}"
echo "Get this from: https://admob.google.com/ → Apps → Your App"
echo "Format: ca-app-pub-1234567890123456~1234567890"
read -p "Enter your AdMob Android App ID: " ADMOB_APP_ID

# AdMob Banner Unit ID
echo ""
echo -e "${GREEN}2. AdMob Banner Ad Unit ID${NC}"
echo "Get this from: AdMob → Ad Units → Banner"
echo "Format: ca-app-pub-1234567890123456/1234567890"
read -p "Enter your Banner Ad Unit ID: " BANNER_UNIT_ID

# AdMob Rewarded Unit ID
echo ""
echo -e "${GREEN}3. AdMob Rewarded Ad Unit ID${NC}"
echo "Get this from: AdMob → Ad Units → Rewarded"
echo "Format: ca-app-pub-1234567890123456/0987654321"
read -p "Enter your Rewarded Ad Unit ID: " REWARDED_UNIT_ID

# RevenueCat API Key
echo ""
echo -e "${GREEN}4. RevenueCat Android API Key${NC}"
echo "Get this from: https://app.revenuecat.com/ → Project Settings → API Keys"
echo "Format: goog_aBcDeFgHiJkLmNoPqRsTuVwXyZ"
read -p "Enter your RevenueCat Android API Key: " REVENUECAT_KEY

echo ""
echo -e "${YELLOW}Updating files...${NC}"

# Backup original files
cp app.json app.json.backup
cp src/services/AdService.js src/services/AdService.js.backup
cp src/services/PurchaseService.js src/services/PurchaseService.js.backup

echo "✓ Created backups"

# Update app.json
sed -i.tmp "s|\"androidAppId\": \"ca-app-pub-[^\"]*\"|\"androidAppId\": \"$ADMOB_APP_ID\"|g" app.json
rm app.json.tmp 2>/dev/null
echo "✓ Updated app.json"

# Update AdService.js
sed -i.tmp "s|android: __DEV__ ? TestIds.BANNER : '[^']*'|android: __DEV__ ? TestIds.BANNER : '$BANNER_UNIT_ID'|g" src/services/AdService.js
sed -i.tmp "s|android: __DEV__ ? TestIds.REWARDED : '[^']*'|android: __DEV__ ? TestIds.REWARDED : '$REWARDED_UNIT_ID'|g" src/services/AdService.js
rm src/services/AdService.js.tmp 2>/dev/null
echo "✓ Updated AdService.js"

# Update PurchaseService.js
sed -i.tmp "s|const REVENUECAT_API_KEY_ANDROID = '[^']*'|const REVENUECAT_API_KEY_ANDROID = '$REVENUECAT_KEY'|g" src/services/PurchaseService.js
rm src/services/PurchaseService.js.tmp 2>/dev/null
echo "✓ Updated PurchaseService.js"

echo ""
echo -e "${GREEN}✅ All API keys updated successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the changes in the files"
echo "2. Build production version: eas build --platform android --profile production"
echo "3. Upload to Play Console"
echo ""
echo -e "${RED}⚠️  IMPORTANT:${NC}"
echo "- Backups saved as *.backup files"
echo "- Test the app before uploading to Play Store"
echo "- Never commit API keys to public repositories"
echo ""
