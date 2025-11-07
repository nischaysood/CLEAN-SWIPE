#!/bin/bash

# Build Development App for Physical Device
# This creates an installable app you can test on your phone

echo "📱 Building CleanSwipe for Your Phone"
echo "======================================"
echo ""

# Check if logged in to EAS
if ! eas whoami &> /dev/null; then
    echo "❌ Not logged in to EAS"
    echo "Please run: eas login"
    exit 1
fi

echo "✅ Logged in as: $(eas whoami)"
echo ""

# Show menu
echo "Which platform do you want to build for?"
echo ""
echo "1) iOS (iPhone/iPad)"
echo "2) Android"
echo "3) Both iOS and Android"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🍎 Building for iOS..."
        echo ""
        echo "📝 What will happen:"
        echo "   1. EAS will build your app in the cloud (~10-15 minutes)"
        echo "   2. You'll get a link to install via TestFlight or direct install"
        echo "   3. Install on your iPhone"
        echo "   4. Run 'npx expo start --dev-client' and scan QR code"
        echo ""
        read -p "Continue? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "🚀 Starting iOS build..."
            echo "This will take 10-15 minutes. You can close this terminal."
            echo ""
            eas build --profile development --platform ios
            
            echo ""
            echo "✅ Build complete!"
            echo ""
            echo "📲 Next steps:"
            echo "   1. Check your email for the build link"
            echo "   2. Open link on your iPhone to install"
            echo "   3. Run: npx expo start --dev-client"
            echo "   4. Scan QR code with Camera app"
            echo "   5. Start testing!"
        fi
        ;;
    2)
        echo ""
        echo "🤖 Building for Android..."
        echo ""
        echo "📝 What will happen:"
        echo "   1. EAS will build your app in the cloud (~10-15 minutes)"
        echo "   2. You'll get a download link for the APK"
        echo "   3. Download and install on your Android phone"
        echo "   4. Run 'npx expo start --dev-client' and scan QR code"
        echo ""
        read -p "Continue? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "🚀 Starting Android build..."
            echo "This will take 10-15 minutes. You can close this terminal."
            echo ""
            eas build --profile development --platform android
            
            echo ""
            echo "✅ Build complete!"
            echo ""
            echo "📲 Next steps:"
            echo "   1. Download the APK from the link"
            echo "   2. Install on your Android phone"
            echo "   3. Run: npx expo start --dev-client"
            echo "   4. Scan QR code with Expo Go or Camera"
            echo "   5. Start testing!"
        fi
        ;;
    3)
        echo ""
        echo "📱 Building for both iOS and Android..."
        echo ""
        echo "This will take ~20-30 minutes total."
        echo ""
        read -p "Continue? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "🚀 Starting builds..."
            echo ""
            eas build --profile development --platform all
            
            echo ""
            echo "✅ Builds complete!"
            echo ""
            echo "📲 Next steps:"
            echo "   1. Check your email for build links"
            echo "   2. Install on your devices"
            echo "   3. Run: npx expo start --dev-client"
            echo "   4. Scan QR code to test"
        fi
        ;;
    *)
        echo ""
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 TIP: While waiting for the build, you can:"
echo "   • Read TESTING_GUIDE.md"
echo "   • Check your email for build notifications"
echo "   • Prepare test photos on your phone"
echo ""
echo "🔗 Track build progress:"
echo "   https://expo.dev/accounts/$(eas whoami)/projects/clean-swipe/builds"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
