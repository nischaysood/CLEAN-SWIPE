#!/bin/bash

# Quick Start Script for CleanSwipe
# Gets you testing in under 2 minutes!

echo "🚀 CleanSwipe Quick Start"
echo "========================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if we need to prebuild
if [ ! -d "ios" ] && [ ! -d "android" ]; then
    echo "⚙️  First time setup detected..."
    echo "This will prepare the native code (takes ~2 minutes)"
    read -p "Continue? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx expo prebuild
    else
        echo "Skipping prebuild. You can run it later with: npx expo prebuild"
    fi
    echo ""
fi

echo "✅ Ready to test!"
echo ""
echo "Choose your testing method:"
echo ""
echo "1) iOS Simulator (Mac only)"
echo "2) Android Emulator"
echo "3) Physical Device (scan QR code)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🍎 Starting iOS Simulator..."
        echo "This will build and install the app (~3-5 minutes first time)"
        echo ""
        npx expo run:ios
        ;;
    2)
        echo ""
        echo "🤖 Starting Android Emulator..."
        echo "Make sure you have an emulator running!"
        echo "This will build and install the app (~3-5 minutes first time)"
        echo ""
        npx expo run:android
        ;;
    3)
        echo ""
        echo "📱 Starting development server..."
        echo ""
        echo "Instructions:"
        echo "1. Install Expo Go app on your phone"
        echo "2. Scan the QR code that appears"
        echo "3. Start testing!"
        echo ""
        echo "Note: For full native features, you'll need a development build."
        echo "Run './test-app.sh' and choose option 2 or 3 to build one."
        echo ""
        npx expo start --dev-client
        ;;
    *)
        echo ""
        echo "Invalid choice. Run the script again."
        exit 1
        ;;
esac
