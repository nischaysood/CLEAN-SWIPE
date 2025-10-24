# 🔧 CleanSwipe Development Guide

Technical documentation for developers working on CleanSwipe.

## Architecture Overview

### Component Hierarchy

```
App.js
└── GalleryScreen.js (Main Container)
    ├── TopPanel.js (Header)
    ├── SwipeCard.js (Photo Card with Gestures)
    └── BottomActions.js (Footer Buttons)
```

### State Management

The app uses React hooks for state management:

**GalleryScreen State**:
- `photos`: Array of photo objects from MediaLibrary
- `currentIndex`: Index of currently displayed photo
- `deletedCount`: Number of photos deleted in this session
- `deletedPhotos`: Array of deleted photo objects (for undo)
- `permissionGranted`: Boolean for media library permission status
- `loading`: Loading state for async operations

### Data Flow

1. **Photo Loading**:
   - Request permissions via `MediaLibrary.requestPermissionsAsync()`
   - Fetch photos via `MediaLibrary.getAssetsAsync()`
   - Convert iOS URIs via `MediaLibrary.getAssetInfoAsync()`
   - Store in state as array

2. **Photo Actions**:
   - User swipes or taps button
   - Action handler called (delete/skip)
   - Photo deleted via `MediaLibrary.deleteAssetsAsync()`
   - State updated (increment index, update counters)
   - Next photo rendered

3. **Animation Flow**:
   - Gesture detected by `PanGestureHandler`
   - Shared values updated (translateX, translateY)
   - Animated styles computed via `useAnimatedStyle`
   - Transform applied with spring physics

## Key Implementation Details

### 1. Photo URI Handling (iOS)

iOS returns `ph://` URIs that can't be displayed directly. We convert them:

```javascript
const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
const localUri = assetInfo.localUri || assetInfo.uri;
```

### 2. Swipe Gesture Detection

Uses `react-native-gesture-handler` with threshold detection:

```javascript
const SWIPE_THRESHOLD = 120; // pixels

onEnd: (event) => {
  const shouldSwipeLeft = translateX.value < -SWIPE_THRESHOLD;
  const shouldSwipeRight = translateX.value > SWIPE_THRESHOLD;
  // ... handle swipe
}
```

### 3. Animation System

Uses `react-native-reanimated` for 60fps native animations:

- **Shared Values**: `translateX`, `translateY` run on UI thread
- **Interpolation**: Maps translation to rotation and opacity
- **Spring Physics**: Natural motion feel via `withSpring()`
- **Native Driver**: All animations use native driver for performance

### 4. Photo Deletion

```javascript
await MediaLibrary.deleteAssetsAsync([photoId]);
```

⚠️ **Note**: This is permanent deletion. Phase 2 will add temporary storage before deletion.

## Performance Optimizations

### Current Optimizations

1. **Lazy Loading**: Only loads first 100 photos initially
2. **Native Animations**: All animations use `useNativeDriver: true`
3. **Image Optimization**: Uses `resizeMode="cover"` for proper scaling
4. **Gesture Handling**: Runs on UI thread, not JS thread

### Planned Optimizations (Phase 2+)

1. **Pagination**: Load photos in batches as user swipes
2. **Image Caching**: Preload next 2-3 photos
3. **Thumbnail Loading**: Load thumbnails first, full res on demand
4. **Virtual List**: Only render visible + adjacent cards
5. **Memory Management**: Clear old photo references

## Testing Strategy

### Manual Testing Checklist

- [ ] Photo loading on first launch
- [ ] Permission request and denial flows
- [ ] Swipe left gesture (smooth animation)
- [ ] Swipe right gesture (smooth animation)
- [ ] Delete button functionality
- [ ] Skip button functionality
- [ ] Counter updates correctly
- [ ] Completion screen appears
- [ ] App works offline
- [ ] No crashes with 0 photos
- [ ] No crashes with 1000+ photos

### Device Testing

Test on:
- iOS 15+ (iPhone 12 or newer)
- Android 10+ (Various manufacturers)
- Different screen sizes (small phones to tablets)
- Low-end devices for performance

## Debugging

### Enable Debug Mode

```javascript
// In App.js or GalleryScreen.js
const DEBUG = true;

if (DEBUG) {
  console.log('Current photo:', photos[currentIndex]);
  console.log('Deleted count:', deletedCount);
}
```

### Common Issues

**Issue**: Photos not loading
- Check permissions are granted
- Verify MediaLibrary is imported correctly
- Check console for error messages

**Issue**: Animations laggy
- Ensure `react-native-reanimated/plugin` is in babel.config.js
- Check that animations use shared values
- Verify no heavy JS operations during gesture

**Issue**: App crashes on delete
- Check photo ID is valid
- Ensure permission is still granted
- Add try-catch around MediaLibrary calls

## Environment Variables

None required for MVP. Future phases may need:
- API keys for AI features
- Cloud storage credentials
- Analytics tokens

## Build Configuration

### Development Build

```bash
eas build --profile development --platform ios
```

### Production Build

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Build Profiles (eas.json)

- **development**: Internal testing, includes dev client
- **preview**: TestFlight/internal testing
- **production**: App Store/Play Store releases

## Code Style

### File Organization

- Components in `src/components/`
- Screens in `src/screens/`
- Utils (future) in `src/utils/`
- Constants (future) in `src/constants/`

### Naming Conventions

- Components: PascalCase (`SwipeCard.js`)
- Functions: camelCase (`handleDelete`)
- Constants: UPPER_SNAKE_CASE (`SWIPE_THRESHOLD`)
- Styles: camelCase (`container`, `deleteButton`)

### Import Order

1. React imports
2. React Native imports
3. Third-party libraries
4. Local components
5. Utils and constants

## Future Architecture Changes

### Phase 2: State Management

Consider adding:
- Context API for global state
- AsyncStorage for persistence
- State machine for complex flows

### Phase 3: AI Features

- Separate service layer for AI logic
- Worker threads for image processing
- API integration layer

### Phase 4: Backend

- API client module
- Authentication layer
- Sync service
- Conflict resolution

## Contributing

### Adding a New Feature

1. Create feature branch from `main`
2. Add component in appropriate folder
3. Update relevant screen to use component
4. Test on both iOS and Android
5. Update README with new feature
6. Submit PR with description

### Code Review Checklist

- [ ] Code follows style guide
- [ ] No console.logs in production code
- [ ] Animations are smooth (60fps)
- [ ] Works on iOS and Android
- [ ] No memory leaks
- [ ] Error handling present
- [ ] Loading states handled
- [ ] Edge cases considered

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Expo Media Library](https://docs.expo.dev/versions/latest/sdk/media-library/)

## Contact

For questions about the codebase, open an issue or refer to the PRD document.

---

Happy coding! 🚀
