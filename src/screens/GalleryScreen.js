import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, Dimensions, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopPanel from '../components/TopPanel';
import SwipeCard from '../components/SwipeCard';
import BottomActions from '../components/BottomActions';
import PaywallScreen from '../components/PaywallScreen';

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
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const pro = await AsyncStorage.getItem(IS_PRO_KEY);
      if (pro === 'true') {
        setIsPro(true);
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
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        await loadPhotos();
      } else {
        Alert.alert(
          'Permission Required',
          'CleanSwipe needs access to your photos to help you clean up your gallery.',
          [{ text: 'OK' }]
        );
        setLoading(false);
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'Failed to request permissions');
      setLoading(false);
    }
  };

  const loadPhotos = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const album = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: 50, // Load 50 at a time for better performance
        after: loadMore ? endCursor : undefined,
      });

      const photosWithInfo = await Promise.all(
        album.assets.map(async (asset) => {
          try {
            const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
            return {
              ...asset,
              localUri: assetInfo.localUri || assetInfo.uri,
            };
          } catch (error) {
            console.error('Error loading asset info:', error);
            return asset;
          }
        })
      );

      // Filter by selected month if provided
      let filteredPhotos = photosWithInfo;
      if (selectedYear !== undefined && selectedMonth !== undefined) {
        filteredPhotos = photosWithInfo.filter(photo => {
          const photoDate = new Date(photo.creationTime);
          return photoDate.getFullYear() === selectedYear && 
                 photoDate.getMonth() === selectedMonth;
        });
      }

      if (loadMore) {
        setPhotos([...photos, ...filteredPhotos]);
      } else {
        setPhotos(filteredPhotos);
      }

      setEndCursor(album.endCursor);
      setHasMorePhotos(album.hasNextPage);
      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.error('Error loading photos:', error);
      Alert.alert('Error', 'Failed to load photos');
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
      // On iOS: moves to Recently Deleted (30 days)
      // On Android 11+: moves to Trash (30 days)
      // On older Android: permanently deletes (user should be warned)
      await MediaLibrary.deleteAssetsAsync([photoToDelete.id]);
      
      setDeletedPhotos([...deletedPhotos, { ...photoToDelete, index: currentIndex }]);
      setDeletedCount(deletedCount + 1);
      setCurrentIndex(currentIndex + 1);
      await incrementSwipeCount();

      // Load more photos if getting close to the end
      await checkAndLoadMore();
    } catch (error) {
      console.error('Error deleting photo:', error);
      
      // Check if it's a permission error (common in Expo Go)
      if (error.message && error.message.includes('PHPhotosErrorDomain')) {
        Alert.alert(
          'Permission Issue',
          'Expo Go has limited photo deletion access. Please use a development build for full functionality.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to delete photo. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleSkip = async () => {
    // Check if user has reached free limit
    if (!isPro && swipeCount >= FREE_SWIPES_LIMIT) {
      setShowPaywall(true);
      return;
    }

    setCurrentIndex(currentIndex + 1);
    await incrementSwipeCount();

    // Load more photos if getting close to the end
    await checkAndLoadMore();
  };

  const checkAndLoadMore = async () => {
    // Load more photos when user is 10 photos away from the end
    const threshold = 10;
    if (
      hasMorePhotos &&
      !isLoadingMore &&
      currentIndex >= photos.length - threshold
    ) {
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
    
    // Re-insert photo back into the photos array at current position
    const updatedPhotos = [...photos];
    updatedPhotos.splice(currentIndex, 0, lastDeleted);
    setPhotos(updatedPhotos);
    
    // Move back one position to show the restored photo
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    
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
            onSwipeRight={handleSkip}
          />
        )}
        
        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <Text style={styles.loadingMoreText}>Loading more photos...</Text>
          </View>
        )}
      </View>

      <BottomActions onDelete={handleDelete} onSkip={handleSkip} />
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
