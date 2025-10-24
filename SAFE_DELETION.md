# 🗑️ Safe Deletion Feature

CleanSwipe uses **safe deletion** - photos are NOT permanently deleted immediately!

## How It Works

### iOS
When you delete a photo in CleanSwipe:
1. Photo is moved to **"Recently Deleted"** album
2. It stays there for **30 days**
3. You can recover it anytime within 30 days
4. After 30 days, iOS automatically permanently deletes it

**To Recover on iOS:**
- Open Photos app
- Go to Albums → Recently Deleted
- Select photos and tap "Recover"

### Android (11+)
When you delete a photo in CleanSwipe:
1. Photo is moved to **Trash/Bin**
2. It stays there for **30 days**  
3. You can recover it anytime within 30 days
4. After 30 days, Android automatically permanently deletes it

**To Recover on Android:**
- Open Google Photos or Gallery app
- Go to Trash or Bin
- Select photos and tap "Restore"

### Older Android (10 and below)
⚠️ **Warning**: On Android 10 and below, photos may be permanently deleted immediately. Please backup important photos before using CleanSwipe.

## User Experience

### First Delete
When users delete their first photo, they see an alert:

```
🗑️ Safe Deletion

Photos you delete are moved to your phone's Recently 
Deleted album (iOS) or Trash (Android).

You can recover them within 30 days before they're 
permanently removed.

This message won't show again.
```

### Undo Button
The "Undo" button in the top panel shows recovery instructions:

**iOS:**
```
Recover Deleted Photos

Photos are in your "Recently Deleted" album.

Open Photos app → Albums → Recently Deleted to 
recover them within 30 days.
```

**Android:**
```
Recover Deleted Photos

Photos are in your device's Trash/Bin.

Open your gallery app to recover them within 30 days.
```

## Implementation Details

### API Used
```javascript
await MediaLibrary.deleteAssetsAsync([photoId]);
```

This API:
- On iOS: Calls PHPhotoLibrary to move photos to Recently Deleted
- On Android 11+: Uses MediaStore to move to Trash
- On older Android: May permanently delete (depends on manufacturer)

### Storage Keys
```javascript
HAS_SEEN_DELETE_INFO_KEY = '@CleanSwipe:hasSeenDeleteInfo'
```

Tracks whether user has seen the safe deletion info dialog.

### Error Handling

**Expo Go Limitation:**
```
Permission Issue

Expo Go has limited photo deletion access. Please use 
a development build for full functionality.
```

Expo Go cannot delete photos. Users need a development build.

## Testing

### Reset First-Time Dialog
For testing, you can reset the info dialog:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reset
await AsyncStorage.removeItem('@CleanSwipe:hasSeenDeleteInfo');
```

### Verify Deletion Behavior

**On iOS:**
1. Delete a photo in CleanSwipe
2. Open Photos app
3. Go to Albums → Recently Deleted
4. Verify photo is there

**On Android:**
1. Delete a photo in CleanSwipe
2. Open Google Photos
3. Go to Trash
4. Verify photo is there

## User Education

### In-App Messaging
1. **First-time dialog** (shown once)
2. **Undo button** with recovery instructions
3. **Completion screen** could show recovery reminder

### Future Enhancements

**Phase 2:**
- Add "View Recently Deleted" button that opens native Photos app
- Show countdown timer (30 days → 29 days, etc.)
- Add settings to toggle between safe/permanent deletion

**Phase 3:**
- In-app Recently Deleted viewer
- Bulk recovery option
- Custom retention period (7/14/30 days)

**Phase 4:**
- Cloud backup before deletion
- Multi-device sync of deleted photos
- Auto-recovery suggestions

## FAQ

### Q: Are photos really safe?
**A:** Yes! On iOS and modern Android, photos go to a recovery folder for 30 days before permanent deletion.

### Q: Can I recover photos after 30 days?
**A:** No, the OS automatically deletes them after 30 days. If you need longer storage, use cloud backup.

### Q: Why can't CleanSwipe restore photos directly?
**A:** The MediaLibrary API doesn't support restoring from Recently Deleted. Users must use the native Photos app.

### Q: What about Android 10 and below?
**A:** Older Android versions may not have a trash system. We recommend users backup photos before using CleanSwipe.

### Q: Can I bypass the 30-day wait?
**A:** Yes, users can manually empty Recently Deleted in the Photos app to free space immediately.

## Best Practices

1. **Always inform users** that deletion is safe (30-day recovery)
2. **Show recovery instructions** prominently  
3. **Test on real devices** - behavior varies by OS version
4. **Consider older Android** - add warnings if needed
5. **Document clearly** - users should know where to recover

## Platform-Specific Notes

### iOS
- ✅ Recently Deleted album is standard (iOS 8+)
- ✅ 30-day automatic retention
- ✅ User can manually empty
- ✅ Syncs with iCloud (if enabled)

### Android 11+
- ✅ Trash/Bin is standard (Android 11+)
- ✅ 30-day automatic retention
- ✅ User can manually empty
- ⚠️ May vary by manufacturer

### Android 10 and below
- ⚠️ No standard trash system
- ⚠️ May permanently delete immediately
- ⚠️ Varies by manufacturer and gallery app
- 💡 Recommend Google Photos app (has trash)

## Security & Privacy

- Photos in Recently Deleted are still on device
- They count toward storage usage
- They're encrypted if device encryption is enabled
- They sync to cloud if photo sync is enabled

---

**Status**: ✅ Safe deletion implemented with user education
**Platform Support**: iOS (all versions), Android 11+
**Recovery Window**: 30 days (OS managed)
