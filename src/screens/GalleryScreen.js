import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, Dimensions, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopPanel from '../components/TopPanel';
import SwipeCard from '../components/SwipeCard';
import BottomActions from '../components/BottomActions';
import PaywallScreen from '../components/PaywallScreen';
import PurchaseService from '../services/PurchaseService';

const { height } = Dimensions.get('window');

const FREE_SWIPES_LIMIT = 50;
const SWIPE_COUNT_KEY = '@CleanSwipe:swipeCount';
const IS_PRO_KEY = '@CleanSwipe:isPro';
const HAS_SEEN_DELETE_INFO_KEY = '@CleanSwipe:hasSeenDeleteInfo';

export default function GalleryScreen({ selectedYear, selectedMonth, onBack }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [keptCount, setKeptCount] = useState(0);
  const [favoritedCount, setFavoritedCount] = useState(0);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastAction, setLastAction] = useState(null); // For undo: {type, photo, index}
  const [undoTimeout, setUndoTimeout] = useState(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasSeenDeleteInfo, setHasSeenDeleteInfo] = useState(false);
  const [endCursor, setEndCursor] = useState(null);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await loadSwipeCount();
    await loadProStatus();
    await loadDeleteInfoStatus();
    await requestPermissions();
  };

  const loadSwipeCount = async () => {
    try {
      const count = await AsyncStorage.getItem(SWIPE_COUNT_KEY);
      if (count !== null) {
        setSwipeCount(parseInt(count, 10));
      }
    } catch (error) {
      console.error('Error loading swipe count:', error);
    }
  };

  const loadProStatus = async () => {
    try {
      // First check AsyncStorage (offline/cached status)
      const cachedPro = await AsyncStorage.getItem(IS_PRO_KEY);
      if (cachedPro === 'true') {
        setIsPro(true);
      }

      // Then check RevenueCat for real subscription status
      if (PurchaseService.isConfigured()) {
        const isPro = await PurchaseService.checkProStatus();
        setIsPro(isPro);
        
        // Update cache
        await AsyncStorage.setItem(IS_PRO_KEY, isPro ? 'true' : 'false');
      }
    } catch (error) {
      console.error('Error loading pro status:', error);
    }
  };

  const loadDeleteInfoStatus = async () => {
    try {
      const seen = await AsyncStorage.getItem(HAS_SEEN_DELETE_INFO_KEY);
      setHasSeenDeleteInfo(seen === 'true');
    } catch (error) {
      console.error('Error loading delete info status:', error);
    }
  };

  const showDeleteInfoDialog = () => {
    Alert.alert(
      '🗑️ Safe Deletion',
      `Photos you delete are moved to your phone's Recently Deleted album (iOS) or Trash (Android).\n\nYou can recover them within 30 days before they're permanently removed.\n\nThis message won't show again.`,
      [
        {
          text: 'Got it!',
          onPress: async () => {
            try {
              await AsyncStorage.setItem(HAS_SEEN_DELETE_INFO_KEY, 'true');
              setHasSeenDeleteInfo(true);
            } catch (error) {
              console.error('Error saving delete info status:', error);
            }
          },
        },
      ]
    );
  };

  const incrementSwipeCount = async () => {
    const newCount = swipeCount + 1;
    setSwipeCount(newCount);
    try {
      await AsyncStorage.setItem(SWIPE_COUNT_KEY, newCount.toString());
    } catch (error) {
      console.error('Error saving swipe count:', error);
    }

    // Check if limit reached
    if (!isPro && newCount >= FREE_SWIPES_LIMIT) {
      setShowPaywall(true);
    }
  };

  const requestPermissions = async () => {
    try {
      console.log('🔐 Requesting photo permissions...');
      
      // First check current permission
      const { status: currentStatus } = await MediaLibrary.getPermissionsAsync();
      console.log('📱 Current permission status:', currentStatus);
      
      if (currentStatus === 'granted') {
        console.log('✅ Already granted!');
        setPermissionGranted(true);
        await loadPhotos();
        return;
      }

      // Request permission
      console.log('📱 Requesting permission...');
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log('📱 New permission status:', status);
      
      if (status === 'granted') {
        console.log('✅ Permission granted, loading photos...');
        setPermissionGranted(true);
        await loadPhotos();
      } else if (status === 'denied') {
        console.log('❌ Permission denied');
        Alert.alert(
          '📷 Permission Needed!',
          'CleanSwipe needs permission to access your photos. Please tap "Allow" when asked, or enable it in Settings → Apps → CleanSwipe → Permissions.',
          [
            { 
              text: 'Try Again', 
              onPress: () => requestPermissions()
            },
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) }
          ]
        );
        setLoading(false);
      } else {
        console.log('⚠️ Permission status:', status);
        Alert.alert(
          'Permission Issue',
          `Permission status: ${status}. Please go to Settings → Apps → CleanSwipe → Permissions and enable Photos.`,
          [{ text: 'OK', onPress: () => setLoading(false) }]
        );
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Permission error:', error);
      Alert.alert(
        'Error',
        `Permission error: ${error.message}\n\nPlease enable photo access in Settings → Apps → CleanSwipe.`,
        [{ text: 'OK', onPress: () => setLoading(false) }]
      );
      setLoading(false);
    }
  };

  const loadPhotos = async (loadMore = false) => {
    try {
      if (!loadMore) {
        console.log('⚡ Initial load...');
      }
      
      // Don't show loading screen - just load in background!
      if (!loadMore && photos.length === 0) {
        setLoading(true); // Only show loading if NO photos yet
      } else {
        setIsLoadingMore(true);
      }

      // TINY BATCHES for 10k+ photos - only 5 at a time!
      const batchSize = 5;
      
      const album = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: batchSize,
        after: loadMore ? endCursor : undefined,
      });

      if (!loadMore) {
        console.log(`✅ Loaded ${album.assets.length} photos`);
      }

      if (album.assets.length === 0 && !loadMore) {
        Alert.alert(
          'No Photos',
          'No photos found in your gallery!',
          [{ text: 'OK', onPress: () => setLoading(false) }]
        );
        setLoading(false);
        return;
      }

      // Use assets directly - no processing!
      let filteredPhotos = album.assets;
      
      // Filter by month if selected
      if (selectedYear !== undefined && selectedMonth !== undefined) {
        filteredPhotos = album.assets.filter(photo => {
          const photoDate = new Date(photo.creationTime);
          return photoDate.getFullYear() === selectedYear && 
                 photoDate.getMonth() === selectedMonth;
        });
        
        // If no matches in this batch, keep loading more
        if (filteredPhotos.length === 0 && album.hasNextPage) {
          setEndCursor(album.endCursor);
          setHasMorePhotos(album.hasNextPage);
          setLoading(false);
          setIsLoadingMore(false);
          // Auto-load next batch
          setTimeout(() => loadPhotos(true), 100);
          return;
        }
        
        if (filteredPhotos.length === 0 && !album.hasNextPage) {
          Alert.alert(
            'No Photos Found',
            `No photos in ${new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.`,
            [{ text: 'OK', onPress: () => onBack() }]
          );
          setLoading(false);
          return;
        }
      }

      // Add to existing photos (progressive loading!)
      if (loadMore) {
        setPhotos(prev => [...prev, ...filteredPhotos]);
      } else {
        setPhotos(filteredPhotos);
      }

      setEndCursor(album.endCursor);
      setHasMorePhotos(album.hasNextPage);
      setLoading(false);
      setIsLoadingMore(false);
      
      // Only preload if we don't have enough photos yet (check AFTER state update)
      const totalPhotosAfterUpdate = loadMore ? photos.length + filteredPhotos.length : filteredPhotos.length;
      if (!loadMore && filteredPhotos.length > 0 && album.hasNextPage && totalPhotosAfterUpdate < 20) {
        console.log('🔄 Preloading next batch... (total photos:', totalPhotosAfterUpdate, ')');
        // Use a flag to prevent multiple simultaneous preloads
        setTimeout(() => {
          if (totalPhotosAfterUpdate < 20 && album.hasNextPage) {
            loadPhotos(true);
          }
        }, 300);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      Alert.alert(
        'Error',
        `Can't load photos: ${error.message}`,
        [{ text: 'OK', onPress: () => setLoading(false) }]
      );
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleDelete = async () => {
    // Check if user has reached free limit
    if (!isPro && swipeCount >= FREE_SWIPES_LIMIT) {
      setShowPaywall(true);
      return;
    }

    if (currentIndex >= photos.length) return;

    // Show info dialog on first delete
    if (!hasSeenDeleteInfo) {
      showDeleteInfoDialog();
    }

    const photoToDelete = photos[currentIndex];
    try {
      console.log('🗑️ Attempting to delete photo:', photoToDelete.id);
      
      // Check if we have delete permission
      const { granted } = await MediaLibrary.getPermissionsAsync();
      console.log('📱 Current permission status:', granted);
      
      if (!granted) {
        console.log('⚠️ No permission, requesting...');
        const { granted: newGranted } = await MediaLibrary.requestPermissionsAsync();
        if (!newGranted) {
          Alert.alert(
            'Permission Required',
            'CleanSwipe needs permission to delete photos. Please enable in Settings.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      // On iOS: moves to Recently Deleted (30 days)
      // On Android 11+: moves to Trash (30 days)  
      // On older Android: permanently deletes
      console.log('🗑️ Deleting asset...');
      await MediaLibrary.deleteAssetsAsync([photoToDelete.id]);
      console.log('✅ Photo deleted successfully!');
      
      // Remove photo from array
      const updatedPhotos = [...photos];
      updatedPhotos.splice(currentIndex, 1);
      setPhotos(updatedPhotos);
      
      setDeletedPhotos([...deletedPhotos, { ...photoToDelete, index: currentIndex }]);
      setDeletedCount(deletedCount + 1);
      // Don't increment index since we removed the item - next photo is now at current index
      await incrementSwipeCount();

      // Load more photos if getting close to the end
      await checkAndLoadMore();
    } catch (error) {
      console.error('❌ Error deleting photo:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      
      // User-friendly error message
      Alert.alert(
        'Unable to Delete Photo',
        `Could not delete this photo.\n\nError: ${error.message || 'Unknown error'}\n\nTry keeping it instead (swipe right).`,
        [
          { text: 'Keep Photo', onPress: () => handleKeep() },
          { text: 'Try Again', onPress: () => handleDelete() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const handleKeep = async () => {
    // Check if user has reached free limit
    if (!isPro && swipeCount >= FREE_SWIPES_LIMIT) {
      setShowPaywall(true);
      return;
    }

    if (currentIndex >= photos.length) return;

    const currentPhoto = photos[currentIndex];
    
    // Clear any existing undo timeout
    if (undoTimeout) {
      clearTimeout(undoTimeout);
    }

    // Set last action for undo (3 seconds)
    setLastAction({
      type: 'keep',
      photo: currentPhoto,
      index: currentIndex
    });

    // Auto-clear undo after 3 seconds
    const timeout = setTimeout(() => {
      setLastAction(null);
    }, 3000);
    setUndoTimeout(timeout);

    setKeptCount(keptCount + 1);
    setCurrentIndex(currentIndex + 1);
    await incrementSwipeCount();

    // Load more photos if getting close to the end
    await checkAndLoadMore();
  };

  const handleFavorite = async () => {
    // Check if user has reached free limit
    if (!isPro && swipeCount >= FREE_SWIPES_LIMIT) {
      setShowPaywall(true);
      return;
    }

    if (currentIndex >= photos.length) return;

    const currentPhoto = photos[currentIndex];
    
    try {
      // Add to favorites album
      console.log('❤️ Adding to favorites:', currentPhoto.id);
      
      // Create or get favorites album
      const albums = await MediaLibrary.getAlbumsAsync();
      let favoritesAlbum = albums.find(album => album.title === 'Favorites');
      
      if (!favoritesAlbum) {
        favoritesAlbum = await MediaLibrary.createAlbumAsync('Favorites', currentPhoto, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([currentPhoto], favoritesAlbum, false);
      }

      console.log('✅ Added to favorites!');

      // Clear any existing undo timeout
      if (undoTimeout) {
        clearTimeout(undoTimeout);
      }

      // Set last action for undo
      setLastAction({
        type: 'favorite',
        photo: currentPhoto,
        index: currentIndex
      });

      // Auto-clear undo after 3 seconds
      const timeout = setTimeout(() => {
        setLastAction(null);
      }, 3000);
      setUndoTimeout(timeout);

      setFavoritedCount(favoritedCount + 1);
      setCurrentIndex(currentIndex + 1);
      await incrementSwipeCount();

      // Load more photos if getting close to the end
      await checkAndLoadMore();
    } catch (error) {
      console.error('❌ Error adding to favorites:', error);
      Alert.alert(
        'Unable to Favorite',
        `Could not add to favorites: ${error.message}`,
        [{ text: 'OK' }]
      );
    }
  };

  const checkAndLoadMore = async () => {
    // Aggressive loading for first 20 photos, then relax
    const threshold = photos.length < 20 ? 3 : 10;
    
    if (
      hasMorePhotos &&
      !isLoadingMore &&
      currentIndex >= photos.length - threshold
    ) {
      console.log('🔄 Auto-loading more photos...');
      await loadPhotos(true);
    }
  };

  const handleUndo = async () => {
    if (deletedPhotos.length === 0) return;

    const lastDeleted = deletedPhotos[deletedPhotos.length - 1];
    
    // Remove from deletedPhotos array
    const updatedDeletedPhotos = [...deletedPhotos];
    updatedDeletedPhotos.pop();
    setDeletedPhotos(updatedDeletedPhotos);
    
    // Decrease deleted count
    setDeletedCount(deletedCount - 1);
    
    // Re-insert photo back into the photos array
    const updatedPhotos = [...photos];
    // Insert before the current index so it becomes the current photo
    const insertPosition = Math.max(0, currentIndex - 1);
    updatedPhotos.splice(insertPosition, 0, lastDeleted);
    setPhotos(updatedPhotos);
    
    // Set index to show the restored photo
    setCurrentIndex(insertPosition);
    
    // Note: The photo is already in "Recently Deleted" on the device
    // We can't un-delete it from there, but we restore it in the app's flow
    Alert.alert(
      'Photo Restored',
      'Photo has been restored to your swipe queue!\n\nNote: It\'s still in "Recently Deleted" on your device. You can recover it permanently from the Photos app.',
      [{ text: 'OK' }]
    );
  };

  const handleUpgrade = async () => {
    // TODO: Implement actual payment integration (Stripe, RevenueCat, etc.)
    Alert.alert(
      'Upgrade to Pro',
      'Payment integration coming soon! For now, enjoy unlimited swipes.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: async () => {
            try {
              await AsyncStorage.setItem(IS_PRO_KEY, 'true');
              setIsPro(true);
              setShowPaywall(false);
              Alert.alert('Success', 'You now have unlimited swipes!');
            } catch (error) {
              console.error('Error upgrading:', error);
            }
          },
        },
      ]
    );
  };

  const currentPhoto = photos[currentIndex];

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading your photos...</Text>
        </View>
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.messageText}>📸</Text>
          <Text style={styles.messageTitle}>Permission Required</Text>
          <Text style={styles.messageSubtitle}>
            CleanSwipe needs access to your photos to help you clean up your gallery.
          </Text>
        </View>
      </View>
    );
  }

  // Show paywall if limit reached
  if (showPaywall) {
    return <PaywallScreen swipesUsed={swipeCount} onUpgrade={handleUpgrade} />;
  }

  const remainingSwipes = isPro ? '∞' : Math.max(0, FREE_SWIPES_LIMIT - swipeCount);

  return (
    <View style={styles.container}>
      <TopPanel 
        deletedCount={deletedCount} 
        onUndo={handleUndo} 
        canUndo={deletedPhotos.length > 0}
        swipesRemaining={remainingSwipes}
        isPro={isPro}
        onBack={onBack}
      />
      
      <View style={styles.cardContainer}>
        {currentPhoto && (
          <SwipeCard
            key={currentPhoto.id}
            photo={currentPhoto}
            onSwipeLeft={handleDelete}
            onSwipeRight={handleKeep}
            onSwipeUp={handleFavorite}
          />
        )}
        
        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <Text style={styles.loadingMoreText}>Loading more photos...</Text>
          </View>
        )}
      </View>

      <BottomActions 
        onDelete={handleDelete} 
        onKeep={handleKeep}
        onFavorite={handleFavorite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingMoreContainer: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loadingMoreText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 80,
    marginBottom: 20,
  },
  messageTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  messageSubtitle: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsText: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
  },
});
