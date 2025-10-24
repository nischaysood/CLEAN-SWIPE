# 📸 CleanSwipe

A fun, Tinder-style mobile app to help you declutter your photo gallery. Swipe left to delete, right to keep!

## ✨ Features

- 🎯 **Swipe Interface**: Tinder-style swipe gestures for quick photo decisions
- ⚡ **Smooth Animations**: Physics-based animations using React Native Reanimated
- 📱 **Offline-First**: Works completely offline, no backend required
- 🗑️ **Safe Deletion**: Photos go to Recently Deleted/Trash (30-day recovery) - see [SAFE_DELETION.md](SAFE_DELETION.md)
- 🔄 **Delete & Skip**: Easy controls to delete or skip photos
- 📊 **Track Progress**: Real-time counter of deleted photos
- 🔁 **Infinite Scrolling**: Photos load automatically as you swipe (handles thousands of photos)
- 📅 **Month Selector**: Browse and clean photos by month
- ↶ **Working Undo**: Restore accidentally deleted photos
- 🎨 **Dark Theme**: Beautiful dark UI optimized for photo viewing
- 📲 **Cross-Platform**: Works on both iOS and Android
- 💎 **Freemium Model**: 50 free swipes, upgrade for unlimited (see [FREE_TIER.md](FREE_TIER.md))
- 💳 **Payment Ready**: Complete guides for iOS App Store & Android Play Store monetization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device**:
   
   For iOS:
   ```bash
   npm run ios
   ```
   
   For Android:
   ```bash
   npm run android
   ```

### Important: Development Build Required

⚠️ **Note**: This app requires a development build to access the full photo library. Expo Go has limited media library access.

To create a development build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for iOS
eas build --platform ios --profile development

# Build for Android
eas build --platform android --profile development
```

## 🎮 How to Use

1. **Launch the app** - Grant photo library permissions when prompted
2. **Swipe left** to delete a photo or **swipe right** to keep it
3. **Tap Delete (❌)** button to delete without swiping
4. **Tap Skip (⏭️)** button to keep without swiping
5. **Track your progress** with the deleted counter at the top
6. **Undo feature** (coming soon in v2) - temporary recycle bin

## 🏗️ Project Structure

```
clean-swipe/
├── App.js                      # Main app entry point
├── src/
│   ├── screens/
│   │   └── GalleryScreen.js   # Main gallery screen with photo logic
│   └── components/
│       ├── TopPanel.js        # Header with counter and undo button
│       ├── SwipeCard.js       # Animated swipeable photo card
│       └── BottomActions.js   # Footer with delete/skip buttons
├── assets/                     # App icons and splash screens
├── package.json
├── app.json                    # Expo configuration
└── babel.config.js
```

## 🎨 Design Specs

- **Background**: `#000000` (Pure black)
- **Delete Color**: `#FF5252` (Red)
- **Skip Color**: `#555555` (Gray)
- **Undo Color**: `#4CAF50` (Green)
- **Text**: `#FFFFFF` (White)

## 📦 Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Language**: JavaScript (ES6+)
- **Libraries**:
  - `expo-media-library` - Photo gallery access
  - `react-native-gesture-handler` - Swipe gesture detection
  - `react-native-reanimated` - Smooth animations

## 🔒 Permissions

The app requires the following permissions:

- **iOS**: Photo Library Access (`NSPhotoLibraryUsageDescription`)
- **Android**: 
  - `READ_EXTERNAL_STORAGE`
  - `WRITE_EXTERNAL_STORAGE`
  - `READ_MEDIA_IMAGES`

## 🛠️ Development Roadmap

### Phase 1 - MVP ✅
- [x] Vertical layout with header, photo, footer
- [x] Swipe gestures and animations
- [x] Delete, skip functionality
- [x] Deleted photo counter

### Phase 2 - Polish (Coming Soon)
- [ ] Improved undo with temporary recycle bin
- [ ] Better card stacking effect
- [ ] Enhanced transitions
- [ ] Haptic feedback

### Phase 3 - Smart Cleanup
- [ ] Duplicate photo detection
- [ ] Blurry photo detection
- [ ] Screenshot cleanup suggestions
- [ ] Batch operations

### Phase 4 - Cloud Integration
- [ ] Google Photos integration
- [ ] iCloud sync
- [ ] Backup before delete

## ⚠️ Known Limitations

- **Undo**: Currently shows a notice that photos are permanently deleted. Future versions will include a temporary recycle bin before permanent deletion.
- **Performance**: Loading large photo libraries (1000+ photos) may take time on initial load.
- **Permissions**: Expo Go has limited media library access. Use a development build for full functionality.

## 🐛 Troubleshooting

### iOS Issues

**Problem**: Can't see photos or getting `ph://` URI errors

**Solution**: The app automatically converts iOS photo URIs using `MediaLibrary.getAssetInfoAsync()`. Make sure you're using a development build, not Expo Go.

### Android Issues

**Problem**: Permission denied errors

**Solution**: Make sure to grant storage permissions when prompted. You may need to go to Settings > Apps > CleanSwipe > Permissions to manually enable them.

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ for people with messy photo galleries
