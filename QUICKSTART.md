# 🚀 CleanSwipe Quick Start Guide

Get up and running with CleanSwipe in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Development Server

```bash
npm start
```

This will open the Expo Dev Tools in your browser.

## Step 3: Run on Your Device

### Option A: Using Expo Go (Limited Functionality)
⚠️ **Note**: Expo Go has limited photo library access. Recommended for UI testing only.

1. Install Expo Go on your phone from App Store/Play Store
2. Scan the QR code from the terminal
3. Grant photo permissions when prompted

### Option B: Development Build (Recommended)
✅ **Full photo library access**

#### For iOS:
```bash
# Install EAS CLI (one time)
npm install -g eas-cli

# Login to Expo
eas login

# Configure project (one time)
eas build:configure

# Build for iOS simulator
eas build --platform ios --profile development

# After build completes, install on simulator
```

#### For Android:
```bash
# Build for Android
eas build --platform android --profile development

# After build completes, install the APK on your device
```

## Step 4: Add App Icons (Optional)

Before publishing, add these files to the `assets/` folder:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)

See `assets/README.md` for details.

## Testing the App

1. **Grant Permissions**: When you first open the app, grant photo library access
2. **Swipe Photos**: 
   - Swipe left = Delete
   - Swipe right = Keep
3. **Use Buttons**: Tap Delete (❌) or Skip (⏭️) buttons
4. **Track Progress**: Watch the deleted counter at the top

## Common Issues

### "No photos showing up"
- Make sure you granted photo library permissions
- On iOS, use a development build (not Expo Go)
- Check that you have photos in your gallery

### "App crashes when swiping"
- Make sure all dependencies are installed: `npm install`
- Clear cache: `expo start -c`
- Rebuild the app

### "Permission denied"
- Go to phone Settings > Apps > CleanSwipe > Permissions
- Enable Photos/Media access

## Development Commands

```bash
# Start dev server
npm start

# Start with cache cleared
expo start -c

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Check for updates
expo doctor
```

## Next Steps

1. **Customize**: Modify colors in component StyleSheet sections
2. **Add Features**: Check `README.md` for roadmap ideas
3. **Test Thoroughly**: Try with different photo types and sizes
4. **Build for Production**: Use `eas build` when ready to ship

## Need Help?

- Check `README.md` for detailed documentation
- Review PRD document for feature requirements
- Open an issue on GitHub for bugs

---

Happy swiping! 🎉
