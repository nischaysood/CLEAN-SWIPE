# CleanSwipe Testing Guide

## Quick Start

### Option 1: Use the Test Script (Easiest)
```bash
./test-app.sh
```

This interactive script helps you:
- Start the dev server
- Build development apps
- Install on simulators/emulators
- Clear cache
- Check diagnostics

### Option 2: Manual Commands

#### Start Development Server
```bash
npx expo start --dev-client
```

#### Build & Install on iOS Simulator
```bash
npx expo run:ios
```

#### Build & Install on Android Emulator
```bash
npx expo run:android
```

## Testing Checklist

### 1. Photo Permissions
- [ ] App requests photo access on first launch
- [ ] Graceful handling if permission denied
- [ ] Can retry permission request

### 2. Photo Loading
- [ ] Photos load quickly (within 2 seconds)
- [ ] Smooth scrolling through photos
- [ ] No lag when swiping
- [ ] Images display correctly

### 3. Swipe Gestures
- [ ] Swipe left = Delete (red overlay)
- [ ] Swipe right = Keep (green overlay)
- [ ] Swipe up = Favorite (pink overlay)
- [ ] Smooth animations
- [ ] Card returns to center if swipe too short

### 4. Button Actions
- [ ] Delete button works
- [ ] Keep button works
- [ ] Favorite button works
- [ ] Visual feedback on tap

### 5. Undo Functionality
- [ ] Undo button appears after action
- [ ] Undo restores photo to queue
- [ ] Undo disappears after 3 seconds
- [ ] Counter updates correctly

### 6. Deleted Photos Screen
- [ ] Can view deleted photos
- [ ] Can select multiple photos
- [ ] Can restore photos
- [ ] Can permanently delete photos
- [ ] Back button works

### 7. Free Tier Limits
- [ ] Counter shows remaining swipes
- [ ] Paywall appears at 50 swipes
- [ ] Can continue after "upgrading"

### 8. Performance
- [ ] No crashes
- [ ] Smooth 60fps animations
- [ ] Low memory usage
- [ ] Fast photo loading

### 9. Edge Cases
- [ ] Works with 0 photos
- [ ] Works with 1000+ photos
- [ ] Handles corrupted images
- [ ] Works offline (after initial load)

## Common Issues & Fixes

### Issue: "Native module not found"
**Fix:** Rebuild the development client
```bash
npx expo prebuild --clean
npx expo run:ios  # or run:android
```

### Issue: Photos not loading
**Fix:** Check permissions in Settings → Privacy → Photos

### Issue: Slow performance
**Fix:** Clear cache and rebuild
```bash
rm -rf node_modules .expo
npm install
npx expo start --clear
```

### Issue: Gestures not working
**Fix:** Make sure you're using a development build, not Expo Go

## Testing on Real Devices

### iOS (Physical Device)
1. Build development app:
   ```bash
   eas build --profile development --platform ios
   ```
2. Install via TestFlight or direct install
3. Scan QR code from `npx expo start --dev-client`

### Android (Physical Device)
1. Build development app:
   ```bash
   eas build --profile development --platform android
   ```
2. Download and install APK
3. Scan QR code from `npx expo start --dev-client`

## Performance Testing

### Check FPS
Enable performance monitor in dev menu:
- iOS: Shake device → "Show Performance Monitor"
- Android: Shake device → "Show Performance Monitor"

Target: 60 FPS during swipes

### Check Memory
Use Xcode Instruments (iOS) or Android Profiler to monitor:
- Memory usage should stay under 200MB
- No memory leaks after 100+ swipes

## Automated Testing (Future)

```bash
# Unit tests
npm test

# E2E tests (when implemented)
npm run test:e2e
```

## Reporting Issues

When reporting bugs, include:
1. Device model and OS version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots/video if possible
5. Console logs (check dev tools)

## Tips for Best Testing Experience

1. **Use real photos**: Test with your actual photo library
2. **Test edge cases**: Try with 0 photos, 1000+ photos, corrupted images
3. **Test gestures**: Try fast swipes, slow swipes, diagonal swipes
4. **Test interruptions**: Try phone calls, notifications during use
5. **Test different screen sizes**: iPhone SE, iPhone Pro Max, iPad, etc.

## Next Steps After Testing

1. Fix any bugs found
2. Optimize performance issues
3. Add analytics to track user behavior
4. Implement real payment integration
5. Submit to App Store / Play Store

Happy testing! 🚀
