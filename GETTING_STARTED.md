# 🎯 Getting Started with CleanSwipe

Follow these steps to get your app running in under 10 minutes!

## ✅ Step-by-Step Checklist

### 1. Install Dependencies ⏱️ 2-3 minutes

```bash
cd /Users/nischaysood/Desktop/clean-swipe
npm install
```

Wait for all packages to download and install.

---

### 2. Add App Icons (Optional) ⏱️ 5 minutes

**Option A: Generate Placeholders** (if you have ImageMagick):
```bash
./generate-assets.sh
```

**Option B: Create Your Own**:
- Add `icon.png` (1024x1024) to `assets/` folder
- Add `splash.png` (1242x2436) to `assets/` folder  
- Add `adaptive-icon.png` (1024x1024) to `assets/` folder

**Option C: Skip for Now**:
- The app will run without icons for development

---

### 3. Start the App ⏱️ 1 minute

```bash
npm start
```

This opens Expo Dev Tools. You'll see a QR code in your terminal.

---

### 4. Run on Device

**For Quick Testing (Limited Features)**:
1. Install "Expo Go" app on your phone
2. Scan the QR code from terminal
3. App opens on your phone

⚠️ **Note**: Expo Go has limited photo access. For full functionality, continue to Step 5.

**For Full Functionality (Recommended)**:
Continue to Step 5 to create a development build.

---

### 5. Create Development Build ⏱️ 15-20 minutes

This step gives you full photo library access.

```bash
# Install EAS CLI (one time only)
npm install -g eas-cli

# Login to Expo (you'll need a free account)
eas login

# Build for your device
eas build --profile development --platform ios    # For iPhone
# OR
eas build --profile development --platform android # For Android
```

The build happens in the cloud. You'll get a download link when it's ready (15-20 min).

---

### 6. Install & Test

**iOS**:
1. Download the IPA file from the link EAS provides
2. Install on your device via Xcode or TestFlight

**Android**:
1. Download the APK from the link EAS provides
2. Install directly on your device
3. Enable "Install from Unknown Sources" if prompted

---

### 7. Grant Permissions

1. Open CleanSwipe
2. Tap "Allow" when asked for photo access
3. Start swiping!

---

## 🎮 How to Use

1. **Swipe Left** = Delete photo ❌
2. **Swipe Right** = Keep photo ✅
3. **Tap Delete** = Delete without swiping
4. **Tap Skip** = Keep without swiping
5. **Watch Counter** = See how many deleted

---

## 🚨 Troubleshooting

### "npm install" fails
```bash
npm install --legacy-peer-deps
```

### No photos showing up
- Make sure you granted photo permissions
- Try using a development build instead of Expo Go
- Check that you have photos in your gallery

### "Expo Go" can't access all photos
- This is normal! Use Step 5 to create a development build
- Expo Go has intentional limitations for security

### App crashes
```bash
# Clear cache and restart
expo start -c
```

### Animations are choppy
- Make sure you're testing on a physical device, not simulator
- Ensure `babel.config.js` has the reanimated plugin

---

## 📱 Recommended Testing Setup

**Best Experience**:
- iPhone 12 or newer (iOS 15+)
- OR Android phone with Android 10+
- Development build installed

**Quick Testing**:
- Any phone with Expo Go app
- Limited photo access
- Good for UI testing

---

## 🎉 You're Ready!

Once you complete these steps, you'll have:
- ✅ A fully functional photo cleanup app
- ✅ Smooth swipe animations
- ✅ Full gallery access (with dev build)
- ✅ Real-time deletion tracking

---

## 📚 Next Steps

- Read `README.md` for full documentation
- Check `PROJECT_SUMMARY.md` for feature overview
- Review `DEVELOPMENT.md` for technical details
- Customize colors and add your own features!

---

## 💡 Pro Tips

1. **Test on real device** - Simulators don't handle gestures as well
2. **Start with Expo Go** - Quick way to see the UI
3. **Build for device** - When you need full photo access
4. **Back up photos** - Before testing deletion features!

---

**Need Help?** Check the troubleshooting section or review the README.md

Happy swiping! 🚀
