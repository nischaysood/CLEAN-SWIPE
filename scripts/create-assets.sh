#!/bin/bash

echo "🎨 Creating placeholder assets for CleanSwipe..."

cd assets

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "✓ Using ImageMagick to create assets..."
    
    # Create app icon (1024x1024)
    convert -size 1024x1024 xc:'#000000' \
        -fill '#FF5252' -draw 'circle 512,512 512,200' \
        -fill '#FFFFFF' -pointsize 200 -font "Helvetica-Bold" \
        -gravity center -annotate +0-50 "CS" \
        icon.png
    
    # Create splash screen (1242x2436)
    convert -size 1242x2436 xc:'#000000' \
        -fill '#FFFFFF' -pointsize 80 -font "Helvetica-Bold" \
        -gravity center -annotate +0+0 "CleanSwipe" \
        splash.png
    
    # Create adaptive icon (1024x1024)
    cp icon.png adaptive-icon.png
    
    echo "✅ Assets created successfully!"
else
    echo "⚠️  ImageMagick not found. Creating simple placeholders..."
    
    # Download placeholder images from placeholder service
    curl -s "https://via.placeholder.com/1024x1024/000000/FF5252?text=CleanSwipe" -o icon.png
    curl -s "https://via.placeholder.com/1242x2436/000000/FFFFFF?text=CleanSwipe" -o splash.png
    curl -s "https://via.placeholder.com/1024x1024/000000/FF5252?text=CS" -o adaptive-icon.png
    
    echo "✅ Placeholder assets created!"
fi

echo ""
echo "Created files:"
ls -lh icon.png splash.png adaptive-icon.png

cd ..
