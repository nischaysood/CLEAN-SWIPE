# 📱 Testing CleanSwipe in iOS Simulator

## The Problem

You're seeing the UI but no photos because:
1. **iOS Simulator has no photos by default**
2. **Expo Go has limited media library access**

## Quick Solution: Add Photos to Simulator

### Method 1: Drag & Drop (Easiest)

1. **Find some photos** on your Mac (any JPG/PNG files)
   - Open Finder → Pictures folder
   - Or download a few images from the web

2. **Open Photos app** in the simulator
   - Click on the simulator window
   - Press `Cmd + Shift + H` to go home
   - Open "Photos" app

3. **Drag photos into simulator**
   - Drag image files from Finder
   - Drop them onto the simulator window
   - Photos will be added to the gallery

4. **Reload CleanSwipe**
   - Press `r` in the terminal where Expo is running
   - Photos should now appear!

### Method 2: Using Terminal

```bash
# Make script executable
chmod +x add-test-photos.sh

# Run script to add 20 test photos
./add-test-photos.sh
```

This downloads 20 random photos and adds them to the simulator.

### Method 3: Safari in Simulator

1. Open Safari in simulator
2. Go to https://picsum.photos
3. Long-press any image
4. Tap "Add to Photos"
5. Repeat for multiple images

## Important Limitations

### ⚠️ Expo Go Limitations

From the warning you saw:
```
Due to changes in Android's permission requirements, Expo Go 
can no longer provide full access to the media library.
```

**What this means:**
- ✅ You CAN view photos
- ❌ You CANNOT delete photos in Expo Go
- ❌ You'll get permission errors when trying to delete

**The error you'll see:**
```
Error deleting photo: [Error: Couldn't remove assets: 
(PHPhotosErrorDomain error 3072.)]
```

### ✅ Solution: Development Build

For **full functionality** (actual photo deletion), you need a development build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for simulator
eas build --profile development --platform ios
```

## Testing Checklist

### What You CAN Test in Expo Go:

✅ **UI/UX:**
- Swipe gestures
- Animations
- Card transitions
- Button interactions
- Counters updating

✅ **Photo Loading:**
- Photos appear in cards
- Photo scrolling/pagination
- Loading states

✅ **Navigation:**
- Permission screen
- Paywall screen (after 50 swipes)
- First-time dialogs

### What You CANNOT Test in Expo Go:

❌ **Photo Deletion** - Will show permission error
❌ **Undo/Recovery** - Depends on deletion
❌ **Full Gallery Access** - Limited by Expo Go

## Recommended Testing Workflow

### Phase 1: UI Testing (Expo Go) ✅ Current

1. Add photos to simulator
2. Test swipe gestures
3. Test animations
4. Test UI flows
5. Test paywall at 50 swipes

### Phase 2: Full Testing (Development Build)

1. Create development build
2. Install on device/simulator
3. Test actual photo deletion
4. Test recovery in Photos app
5. Test with real photo library

## Adding Photos - Detailed Steps

### Step-by-Step: Drag & Drop Method

1. **Download test images:**
   ```bash
   # Open a folder
   open ~/Downloads
   
   # Download some images
   curl https://picsum.photos/1080/1920 -o ~/Downloads/test1.jpg
   curl https://picsum.photos/1080/1920 -o ~/Downloads/test2.jpg
   curl https://picsum.photos/1080/1920 -o ~/Downloads/test3.jpg
   ```

2. **With simulator running:**
   - Go to home screen (Cmd + Shift + H)
   - Open Photos app
   - Drag images from Downloads folder
   - Drop onto simulator window

3. **Verify photos added:**
   - Open Photos app in simulator
   - Check "Recents" album
   - Should see your test images

4. **Test CleanSwipe:**
   - Open CleanSwipe app
   - Grant photo permissions if asked
   - Photos should now appear!

## Troubleshooting

### "No photos showing up"

**Check 1:** Photos in simulator
- Open Photos app in simulator
- Verify photos exist in Recents

**Check 2:** Permissions granted
- Settings → Privacy → Photos
- CleanSwipe should have "Full Access"

**Check 3:** Reload app
- Press `r` in Expo terminal
- Or shake simulator → Reload

### "Permission denied when deleting"

This is **expected in Expo Go**. The app warns you:
```
Expo Go has limited photo deletion access. 
Please use a development build for full functionality.
```

You can still test:
- ✅ UI and gestures
- ✅ Photo loading
- ✅ Counters and state
- ❌ Actual deletion (need dev build)

### "Can't drag photos into simulator"

Try this method instead:
1. Open Safari in simulator
2. Go to https://unsplash.com
3. Find any photo
4. Long-press photo
5. "Add to Photos"
6. Repeat for 10+ photos

## Quick Test Images

Here are direct links to test images:

```
https://picsum.photos/1080/1920?random=1
https://picsum.photos/1080/1920?random=2
https://picsum.photos/1080/1920?random=3
https://picsum.photos/1080/1920?random=4
https://picsum.photos/1080/1920?random=5
```

Download these and drag into simulator.

## Development Build Benefits

When you create a development build, you get:
- ✅ Full media library access
- ✅ Actual photo deletion
- ✅ Recently Deleted testing
- ✅ Real-world performance testing
- ✅ All app features working

## Next Steps

**For UI Testing Now:**
1. Add 10-20 photos to simulator (drag & drop)
2. Reload app (press `r`)
3. Test swiping, animations, UI

**For Full Testing Later:**
1. Create development build with EAS
2. Install on real device
3. Test with your actual photo library
4. Verify deletion and recovery

---

**Current Status:**
- ✅ App is working
- ✅ UI is correct
- ⚠️ Need photos in simulator
- ⚠️ Deletion limited by Expo Go

**Add photos → Reload → Start testing!** 🚀
