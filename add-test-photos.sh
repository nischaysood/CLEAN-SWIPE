#!/bin/bash

# Script to add test photos to iOS Simulator
echo "🖼️  Adding test photos to iOS Simulator..."

# Check if simulator is running
if ! xcrun simctl list devices | grep -q "Booted"; then
    echo "❌ No simulator is running. Please start the simulator first."
    exit 1
fi

# Get booted device ID
DEVICE_ID=$(xcrun simctl list devices | grep "Booted" | head -1 | grep -o -E '\([A-Z0-9-]+\)' | tr -d '()')

echo "📱 Found simulator: $DEVICE_ID"

# Create temp directory with test images
TEMP_DIR="/tmp/cleanswipe-test-photos"
mkdir -p "$TEMP_DIR"

echo "📸 Creating sample photos..."

# Download or create sample images (using placeholder service)
for i in {1..20}; do
    curl -s "https://picsum.photos/1080/1920?random=$i" -o "$TEMP_DIR/photo_$i.jpg"
    echo "  ✓ Created photo $i"
done

echo ""
echo "📤 Adding photos to simulator..."

# Add photos to simulator
xcrun simctl addmedia "$DEVICE_ID" "$TEMP_DIR"/*.jpg

echo ""
echo "✅ Done! Added 20 test photos to simulator."
echo "🔄 Reload your app (press 'r' in terminal) to see the photos."
echo ""
echo "💡 Tip: Open Photos app in simulator to verify photos were added."

# Cleanup
rm -rf "$TEMP_DIR"
