# 📱 Testing CleanSwipe on Your Phone

## Quick Start

### Step 1: Build the Development App

Run this command:
```bash
./build-for-phone.sh
```

Choose your platform (iOS or Android) and wait 10-15 minutes for the build to complete.

### Step 2: Install on Your Phone

**iOS:**
1. Check your email for the build link
2. Open link on your iPhone
3. Follow installation instructions (TestFlight or direct install)

**Android:**
1. Download the APK from the build link
2. Enable "Install from Unknown Sources" if prompted
3. Install the APK

### Step 3: Start Development Server

```bash
npx expo start --dev-client
```

### Step 4: Connect Your Phone

**iOS:**
- Open Camera app
- Point at QR code
- Tap notification to open in CleanSwipe

**Android:**
- Open CleanSwipe app
- Tap "Scan QR Code"
- Point at QR code on your computer

### Step 5: Test!

Grant photo permissions and start swiping!

---

## Detailed Instructions

### Prerequisites

- ✅ EAS account (you're already logged in)
- ✅ Physical device (iPhone or Android)
- ✅ USB cable (optional, for faster testing)
- ✅ Same WiFi network (phone and computer)

### Building for iOS

#### Option 1: Using the Script (Easiest)
```bash
./build-for-phone.sh
# Choose option 1 for iOS
```

#### Option 2: Manual Command
```bash
eas build --profile development --platform ios
```

#### What Happens:
1. **Upload** - Your code is uploaded to EAS servers (~1 min)
2. **Build** - App is compiled in the cloud (~10-15 min)
3. **Notify** - You get an email with download link
4. **Install** - Open link on iPhone to install

#### Installation Methods:

**Method A: Internal Distribution (Recommended)**
- Open build link on your iPhone
- Tap "Install"
- Trust the developer certificate in Settings
- App appears on home screen

**Method B: TestFlight**
- If you have TestFlight set up
- Build will appear in TestFlight
- Install from there

### Building for Android

#### Option 1: Using the Script (Easiest)
```bash
./build-for-phone.sh
# Choose option 2 for Android
```

#### Option 2: Manual Command
```bash
eas build --profile development --platform android
```

#### What Happens:
1. **Upload** - Your code is uploaded (~1 min)
2. **Build** - APK is compiled (~10-15 min)
3. **Download** - You get a download link
4. **Install** - Transfer APK to phone and install

#### Installation:
1. Download APK from build link
2. Transfer to phone (email, cloud, or direct download)
3. Open APK file on phone
4. Enable "Install from Unknown Sources" if prompted
5. Tap "Install"

### Starting the Development Server

Once the app is installed on your phone:

```bash
npx expo start --dev-client
```

This will:
- Start the Metro bundler
- Show a QR code
- Wait for your phone to connect

### Connecting Your Phone

#### iOS:
1. Make sure phone and computer are on same WiFi
2. Open Camera app
3. Point at QR code on computer screen
4. Tap the notification that appears
5. App opens and connects!

#### Android:
1. Make sure phone and computer are on same WiFi
2. Open CleanSwipe app on phone
3. Tap "Scan QR Code" or shake device
4. Point at QR code on computer screen
5. App connects!

### Testing Workflow

```
┌─────────────────────────────────────────────────────────┐
│  1. Build app (once)          → 10-15 minutes           │
│  2. Install on phone (once)   → 2 minutes               │
│  3. Start dev server          → npx expo start          │
│  4. Scan QR code              → Instant connection      │
│  5. Test changes              → Hot reload enabled!     │
│  6. Make code changes         → Auto-updates on phone   │
└─────────────────────────────────────────────────────────┘
```

### Hot Reload

Once connected, any code changes you make will automatically update on your phone! No need to rebuild.

**To reload manually:**
- iOS: Shake device → "Reload"
- Android: Shake device → "Reload"

---

## Testing Checklist

### First Launch
- [ ] App installs successfully
- [ ] App opens without crashing
- [ ] Permission prompt appears
- [ ] Grant photo library access

### Photo Loading
- [ ] Photos load from your gallery
- [ ] Images display correctly
- [ ] Loading is fast (2-3 seconds)
- [ ] No blank images

### Swipe Gestures
- [ ] Swipe left = Delete (red overlay)
- [ ] Swipe right = Keep (green overlay)
- [ ] Swipe up = Favorite (pink overlay)
- [ ] Animations are smooth (60fps)
- [ ] Card returns if swipe too short

### Buttons
- [ ] Delete button works
- [ ] Keep button works
- [ ] Favorite button works
- [ ] Visual feedback on tap

### Performance
- [ ] No lag when swiping
- [ ] Smooth animations
- [ ] Fast photo loading
- [ ] No crashes

### Features
- [ ] Undo button appears after action
- [ ] Undo restores photo
- [ ] Counter updates correctly
- [ ] Deleted photos screen works
- [ ] Can restore deleted photos

---

## Troubleshooting

### Build Issues

**Problem:** "Not logged in to EAS"
```bash
eas login
```

**Problem:** "Project not configured"
```bash
eas build:configure
```

**Problem:** Build fails
- Check build logs in terminal
- Visit: https://expo.dev/accounts/YOUR_USERNAME/projects/clean-swipe/builds
- Look for error messages

### Installation Issues

**iOS: "Untrusted Developer"**
1. Go to Settings → General → VPN & Device Management
2. Find your developer certificate
3. Tap "Trust"

**Android: "Install Blocked"**
1. Go to Settings → Security
2. Enable "Install from Unknown Sources"
3. Try installing again

### Connection Issues

**Can't scan QR code:**
- Make sure phone and computer are on same WiFi
- Try typing the URL manually (shown in terminal)
- Restart dev server: Ctrl+C, then `npx expo start --dev-client`

**App won't connect:**
- Check WiFi connection
- Restart app on phone
- Restart dev server
- Try USB connection (see below)

**Slow loading:**
- Use USB connection for faster development
- Check WiFi signal strength
- Close other apps on phone

### USB Connection (Faster)

**iOS:**
```bash
npx expo start --dev-client --ios
```

**Android:**
```bash
npx expo start --dev-client --android
```

This uses USB instead of WiFi for faster updates.

---

## Advanced Tips

### Faster Development

1. **Use USB connection** - Much faster than WiFi
2. **Enable Fast Refresh** - Automatic in dev mode
3. **Use console.log** - Check terminal for logs
4. **Use React DevTools** - Shake device → "Debug"

### Debugging

**View logs:**
```bash
npx expo start --dev-client
# Logs appear in terminal
```

**React DevTools:**
- Shake device
- Tap "Debug Remote JS"
- Open Chrome DevTools

**Performance Monitor:**
- Shake device
- Tap "Show Performance Monitor"
- Check FPS (should be 60)

### Testing with Different Photos

Test with:
- ✅ Few photos (10-20)
- ✅ Many photos (100+)
- ✅ Large photos (high resolution)
- ✅ Screenshots
- ✅ Downloaded images
- ✅ Camera photos

### Testing Edge Cases

- [ ] No photos in gallery
- [ ] Only 1 photo
- [ ] 1000+ photos
- [ ] Corrupted images
- [ ] Very large images (>10MB)
- [ ] Different aspect ratios

---

## Build Commands Reference

### Development Build (for testing)
```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android

# Both
eas build --profile development --platform all
```

### Preview Build (for sharing)
```bash
# iOS
eas build --profile preview --platform ios

# Android
eas build --profile preview --platform android
```

### Production Build (for app stores)
```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

### Check Build Status
```bash
eas build:list
```

### View Build Details
Visit: https://expo.dev/accounts/YOUR_USERNAME/projects/clean-swipe/builds

---

## Quick Reference

### Build and Test Flow
```bash
# 1. Build (once, 10-15 min)
./build-for-phone.sh

# 2. Install on phone (once, 2 min)
# Follow link in email

# 3. Start dev server (every time)
npx expo start --dev-client

# 4. Scan QR code and test!
```

### Common Commands
```bash
# Start dev server
npx expo start --dev-client

# Start with cache clear
npx expo start --dev-client --clear

# View builds
eas build:list

# Check EAS login
eas whoami

# Login to EAS
eas login
```

---

## Next Steps

1. ✅ Build the app: `./build-for-phone.sh`
2. ✅ Wait for build (10-15 min)
3. ✅ Install on phone
4. ✅ Start dev server: `npx expo start --dev-client`
5. ✅ Scan QR code
6. ✅ Test with real photos!

---

## Need Help?

- **Build issues**: Check https://expo.dev/builds
- **Connection issues**: Make sure same WiFi network
- **App crashes**: Check terminal logs
- **Permission issues**: Check Settings → Privacy → Photos

Happy testing! 🚀
