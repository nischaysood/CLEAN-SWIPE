# 🧭 Product Requirements Document (PRD)

## 🪩 Project Name
**SwipeWipe** – Tinder for Your Gallery

## 💡 Overview
SwipeWipe is a mobile app that helps users clean their photo gallery quickly and enjoyably. Users can swipe through their photos like Tinder — swipe left to delete, swipe right to keep, or swipe up to favorite. It makes decluttering your phone storage fun and intuitive.

## 🎯 Goal
- Make photo cleanup fast, fun, and engaging.
- Help users free up storage space easily.
- Gamify the cleanup process with smooth swipe gestures and a clean UI.

## 👥 Target Users
- Smartphone users with cluttered galleries.
- People who find manual photo cleanup boring or time-consuming.
- Minimalists or users running out of storage.

## 🧩 Core Features

### 1. Photo Swipe Interface
- Tinder-style UI: one photo at a time.
- **Swipe left → Delete**
- **Swipe right → Keep**
- **Swipe up → Favorite**
- Option to undo last action.

### 2. Gallery Access
- Access device gallery (camera roll or media library).
- Load images efficiently in batches for performance.
- Handle permission requests gracefully (Android + iOS).

### 3. Storage Summary
- Show number of photos deleted, kept, and favorited.
- Display total storage space freed.

### 4. Settings
- Toggle: Delete permanently or move to trash.
- Choose image folders (Screenshots, WhatsApp, Camera).
- Light/Dark Mode.

### 5. Progress Tracker (Phase 2)
- Streak counter (e.g., "Cleaned 3 days in a row").
- Progress bar showing percentage of gallery reviewed.

### 6. Undo & Confirmation
- Snackbar/toast on delete action with Undo option.
- Optional confirmation dialog for first few deletions.

## 🎨 UI Layout

### Header Container
- App name/logo ("SwipeWipe")
- Storage summary ("Freed 450MB")

### Photo Card Container
- Central card for photo preview.
- Swipe gestures enabled.

### Footer Container
- Buttons: ❌ Delete (left), ❤️ Favorite (up), ✅ Keep (right)
- Undo button bottom-right.

## 🛠️ Tech Stack

### Frontend
- React Native (Expo)
- expo-media-library
- react-native-gesture-handler
- react-native-reanimated
- AsyncStorage for stats/preferences

### Optional Web Version
- React + Tailwind + Framer Motion

### Backend (Future)
- Firebase for cloud backup and analytics

## 🔄 User Flow
1. Onboarding Screen → Request gallery permission → Explain swiping actions
2. Gallery Load → Fetch and display photos
3. User Swipes:
   - Left → delete
   - Right → keep
   - Up → favorite
4. Undo available for 3 seconds
5. Summary Screen → Show results & space freed

## ⚙️ Future Enhancements
- AI detection of duplicates/blurry photos
- Cloud backup before deletion
- Before/After storage comparison animation
- Share achievement ("I freed 2GB today!")

## 🧱 Development Milestones

### ✅ Acceptance Criteria
- Smooth swipe animations
- Accurate delete/keep/fav logic
- Undo within 3 seconds
- Dynamic summary updates
- Works with 1000+ photos smoothly

## 🚀 SPEED PRIORITY #1

Based on testing with 10K+ photos, these optimizations are CRITICAL:

### Performance Requirements:
- ✅ First photo appears within 2 seconds
- ✅ Load 5 photos at a time (not more!)
- ✅ Progressive background loading
- ✅ Preload 20 photos on startup
- ✅ Auto-load as user swipes
- ✅ No blocking UI operations
- ✅ Smooth 60fps animations

### Technical Optimizations:
```javascript
// Batch size: 5 photos (tested with 100K photos)
const BATCH_SIZE = 5;

// Preload threshold: Start loading when 3 photos remaining
const PRELOAD_THRESHOLD = 3;

// Initial preload: Load 4 batches (20 photos) on startup
const INITIAL_BATCHES = 4;
```

### Memory Management:
- Keep max 50 photos in memory
- Direct URI access (no asset info processing)
- Efficient image caching
