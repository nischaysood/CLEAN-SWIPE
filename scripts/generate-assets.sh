#!/bin/bash

# Generate placeholder assets for CleanSwipe
# This script creates simple placeholder icons for development

echo "Generating placeholder assets for CleanSwipe..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it:"
    echo "   brew install imagemagick"
    echo ""
    echo "Or create assets manually in the assets/ folder:"
    echo "   - icon.png (1024x1024)"
    echo "   - splash.png (1242x2436)"
    echo "   - adaptive-icon.png (1024x1024)"
    exit 1
fi

cd assets

# Generate app icon (1024x1024)
echo "📱 Creating icon.png..."
convert -size 1024x1024 xc:'#000000' \
    -fill '#FF5252' -draw 'roundrectangle 200,200 824,824 100,100' \
    -fill '#FFFFFF' -pointsize 120 -font "Helvetica-Bold" \
    -gravity center -annotate +0+0 "📸\nClean\nSwipe" \
    icon.png

# Generate splash screen (1242x2436)
echo "🎨 Creating splash.png..."
convert -size 1242x2436 xc:'#000000' \
    -fill '#FFFFFF' -pointsize 100 -font "Helvetica-Bold" \
    -gravity center -annotate +0+0 "CleanSwipe" \
    -fill '#AAAAAA' -pointsize 40 -font "Helvetica" \
    -gravity center -annotate +0+150 "Swipe your way to a cleaner gallery" \
    splash.png

# Generate adaptive icon (1024x1024)
echo "🤖 Creating adaptive-icon.png..."
convert -size 1024x1024 xc:'#000000' \
    -fill '#FF5252' -draw 'circle 512,512 512,100' \
    -fill '#FFFFFF' -pointsize 200 -font "Helvetica-Bold" \
    -gravity center -annotate +0+0 "📸" \
    adaptive-icon.png

echo "✅ Placeholder assets generated successfully!"
echo ""
echo "Assets created in ./assets/:"
echo "  - icon.png"
echo "  - splash.png"
echo "  - adaptive-icon.png"
echo ""
echo "These are placeholder images. Replace them with your own designs before publishing."
