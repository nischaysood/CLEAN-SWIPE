#!/bin/bash

# CleanSwipe Test Script
# This script helps you test the app with a development build

echo "🧪 CleanSwipe Test Helper"
echo "========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from the project root."
    exit 1
fi

# Function to show menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo ""
    echo "1) Start development server"
    echo "2) Build development app (iOS)"
    echo "3) Build development app (Android)"
    echo "4) Install development build on iOS simulator"
    echo "5) Install development build on Android emulator"
    echo "6) Clear cache and restart"
    echo "7) Check app diagnostics"
    echo "8) Exit"
    echo ""
    read -p "Enter your choice (1-8): " choice
    
    case $choice in
        1)
            echo ""
            echo "🚀 Starting development server..."
            echo "Scan the QR code with your device to test!"
            npx expo start --dev-client
            ;;
        2)
            echo ""
            echo "📱 Building iOS development app..."
            echo "This will take several minutes..."
            eas build --profile development --platform ios
            ;;
        3)
            echo ""
            echo "🤖 Building Android development app..."
            echo "This will take several minutes..."
            eas build --profile development --platform android
            ;;
        4)
            echo ""
            echo "📲 Installing on iOS simulator..."
            npx expo run:ios
            ;;
        5)
            echo ""
            echo "📲 Installing on Android emulator..."
            npx expo run:android
            ;;
        6)
            echo ""
            echo "🧹 Clearing cache..."
            rm -rf node_modules
            rm -rf .expo
            npm install
            npx expo start --clear
            ;;
        7)
            echo ""
            echo "🔍 App Diagnostics"
            echo "=================="
            echo ""
            echo "Node version:"
            node --version
            echo ""
            echo "npm version:"
            npm --version
            echo ""
            echo "Expo CLI:"
            npx expo --version
            echo ""
            echo "EAS CLI:"
            eas --version 2>/dev/null || echo "Not installed (run: npm install -g eas-cli)"
            echo ""
            echo "Dependencies:"
            npm list --depth=0 2>/dev/null | grep -E "(expo|react-native)" || echo "Error checking dependencies"
            ;;
        8)
            echo ""
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo ""
            echo "❌ Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Show menu
show_menu

# Keep showing menu after action completes
while true; do
    read -p "Press Enter to return to menu (or Ctrl+C to exit)..."
    show_menu
done
