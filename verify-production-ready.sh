#!/bin/bash

# 🔍 Verify Production Readiness Script
# Run this to check if your app is ready for Play Store launch

echo "🔍 Checking Production Readiness..."
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Check 1: AdMob App ID in app.json
echo "Checking AdMob configuration..."
if grep -q "ca-app-pub-3940256099942544" app.json; then
    echo -e "${RED}✗ Still using TEST AdMob App ID${NC}"
    echo "  → Update in app.json"
    ERRORS=$((ERRORS + 1))
else
    if grep -q "ca-app-pub-" app.json; then
        echo -e "${GREEN}✓ AdMob App ID configured${NC}"
    else
        echo -e "${RED}✗ No AdMob App ID found${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi

# Check 2: Ad Unit IDs in AdService.js
echo "Checking Ad Unit IDs..."
if grep -q "ca-app-pub-XXXXX" src/services/AdService.js; then
    echo -e "${RED}✗ Still using placeholder Ad Unit IDs${NC}"
    echo "  → Update in src/services/AdService.js"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ Ad Unit IDs configured${NC}"
fi

# Check 3: RevenueCat API Key
echo "Checking RevenueCat configuration..."
if grep -q "YOUR_ANDROID_KEY_HERE" src/services/PurchaseService.js; then
    echo -e "${RED}✗ Still using placeholder RevenueCat key${NC}"
    echo "  → Update in src/services/PurchaseService.js"
    ERRORS=$((ERRORS + 1))
else
    if grep -q "goog_" src/services/PurchaseService.js; then
        echo -e "${GREEN}✓ RevenueCat API key configured${NC}"
    else
        echo -e "${YELLOW}⚠ RevenueCat key might not be set${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# Check 4: Package name
echo "Checking package configuration..."
if grep -q "com.nischaysood.cleanswipe" app.json; then
    echo -e "${GREEN}✓ Package name set${NC}"
else
    echo -e "${YELLOW}⚠ Check package name in app.json${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 5: Version
echo "Checking version..."
VERSION=$(grep -o '"version": "[^"]*"' app.json | cut -d'"' -f4)
echo -e "${GREEN}✓ Version: $VERSION${NC}"

# Check 6: Required files exist
echo "Checking required files..."
REQUIRED_FILES=(
    "src/services/AdService.js"
    "src/services/PurchaseService.js"
    "src/components/BannerAdComponent.js"
    "src/screens/ProfileScreen.js"
    "app.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ Missing: $file${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# Summary
echo ""
echo "===================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}Your app is ready for production build!${NC}"
    echo ""
    echo "Next step:"
    echo "  eas build --platform android --profile production"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS WARNING(S)${NC}"
    echo "Your app should work, but review warnings above."
    echo ""
    echo "You can proceed with:"
    echo "  eas build --platform android --profile production"
else
    echo -e "${RED}❌ $ERRORS ERROR(S) FOUND${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS WARNING(S)${NC}"
    fi
    echo ""
    echo "Fix the errors above before building for production."
    echo "Run ./setup-production-keys.sh to update API keys."
fi
echo "===================================="
echo ""
