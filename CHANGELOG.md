# Changelog

All notable changes to CleanSwipe will be documented in this file.

## [1.3.0] - 2025-10-24

### Added
- **Infinite Scrolling**: Photos load continuously as user swipes (50 at a time)
- **Automatic Pagination**: More photos load when user is 10 photos away from end
- **Loading Indicator**: Shows "Loading more photos..." when fetching additional photos
- **Smart Photo Loading**: Only loads what's needed for better performance

### Changed
- Removed "All Done" completion screen (users have thousands of photos)
- Changed batch size from 100 to 50 photos for faster initial load
- Photos now load continuously instead of all at once

### Technical
- Implemented `endCursor` and `hasNextPage` tracking from MediaLibrary API
- Added `checkAndLoadMore()` function with 10-photo threshold
- Added `isLoadingMore` state for background loading
- Optimized photo loading with pagination support

## [1.2.0] - 2025-10-24

### Added
- **Safe Deletion Feature**: Photos now go to Recently Deleted (iOS) or Trash (Android) instead of permanent deletion
- **First-Time Info Dialog**: Users see explanation of safe deletion on first delete
- **Recovery Instructions**: "Undo" button now shows how to recover deleted photos
- **SAFE_DELETION.md**: Complete documentation for safe deletion feature
- **Better Error Handling**: Specific messages for Expo Go permission limitations

### Changed
- Updated delete handler to show first-time safe deletion info
- Modified "Undo" button to display recovery instructions for iOS and Android
- Enhanced error messages for permission issues
- Clarified 30-day recovery window in user messaging

### Technical
- Added `HAS_SEEN_DELETE_INFO_KEY` for tracking first-time dialog
- Implemented platform-specific recovery instructions (iOS/Android)
- Added Platform import for OS-specific messaging
- Improved error handling for PHPhotosErrorDomain errors

## [1.1.0] - 2025-10-24

### Added
- **Freemium Model**: Implemented 50 free swipes limit for new users
- **Swipe Counter**: Shows remaining swipes in top panel
- **Paywall Screen**: Beautiful upgrade screen when free limit is reached
- **Pro Status**: Pro badge (✨ Pro) for unlimited users
- **Persistent Storage**: Swipe count and Pro status saved using AsyncStorage
- **FREE_TIER.md**: Complete documentation for monetization feature

### Changed
- Updated TopPanel to show remaining swipes counter
- Modified GalleryScreen to track and enforce swipe limits
- Enhanced completion screen to show total swipes used

### Technical
- Added `@react-native-async-storage/async-storage` dependency
- Created PaywallScreen component
- Implemented swipe tracking with limit enforcement
- Added Pro upgrade flow (placeholder for payment integration)

## [1.0.0] - 2025-10-24

### Added
- Initial release
- Tinder-style swipe interface
- Photo deletion from gallery
- Skip functionality
- Animated photo cards with gesture detection
- Delete counter
- Undo button (with Phase 2 notice)
- Permission handling for iOS and Android
- Dark theme UI
- Complete documentation (README, QUICKSTART, DEVELOPMENT)

### Components
- GalleryScreen: Main screen with photo management
- SwipeCard: Animated swipeable photo card
- TopPanel: Header with counters
- BottomActions: Footer action buttons

### Technical Stack
- React Native 0.76.9
- Expo SDK 52.0.0
- React Native Reanimated 3.16.1
- React Native Gesture Handler 2.20.2
- Expo Media Library 17.0.3

---

## Roadmap

### [1.2.0] - Planned
- [ ] Implement actual payment integration (RevenueCat/Stripe)
- [ ] Add "Watch Ad for Free Swipes" option
- [ ] Temporary recycle bin before permanent deletion
- [ ] Haptic feedback on swipes

### [1.3.0] - Future
- [ ] Duplicate photo detection
- [ ] Blurry photo detection
- [ ] Screenshot cleanup suggestions
- [ ] Batch operations

### [2.0.0] - Future
- [ ] AI-powered cleanup suggestions
- [ ] Cloud sync (Google Photos, iCloud)
- [ ] Analytics dashboard
- [ ] Settings screen with preferences
