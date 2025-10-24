# Assets Directory

This directory contains app icons and splash screens for CleanSwipe.

## Required Assets

You'll need to add the following assets before building the app:

### 1. App Icon (`icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Design**: Should represent the CleanSwipe brand (suggestion: a photo with a swipe gesture icon)

### 2. Splash Screen (`splash.png`)
- **Size**: 1242x2436 pixels (iPhone X resolution)
- **Format**: PNG
- **Background**: #000000 (black, as specified in app.json)
- **Design**: CleanSwipe logo or app name centered

### 3. Adaptive Icon (`adaptive-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Purpose**: Android adaptive icon foreground
- **Note**: The safe area is the center 66% of the image

## Generating Assets

You can use Expo's asset generation tool:

```bash
npx expo-asset-generator path/to/your/icon.png
```

Or create them manually using design tools like Figma, Sketch, or Photoshop.

## Temporary Solution

For development purposes, you can use placeholder icons:
- Create a simple 1024x1024 PNG with the app name
- Use online tools like https://www.appicon.co/ to generate all sizes

## Design Guidelines

**Color Scheme**:
- Primary: #000000 (Black)
- Accent: #FF5252 (Red for delete)
- Success: #4CAF50 (Green for keep)

**Icon Ideas**:
- Photo frame with swipe gesture arrows
- Gallery grid with a cleanup symbol
- Tinder-style card stack
- Photo with left/right arrows
