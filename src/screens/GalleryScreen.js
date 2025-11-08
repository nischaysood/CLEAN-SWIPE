import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopPanel from '../components/TopPanel';
import SwipeCard from '../components/SwipeCard';
import BottomActions from '../components/BottomActions';
import PaywallScreen from '../components/PaywallScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BannerAdComponent from '../components/BannerAdComponent';
import CustomAlert from '../components/CustomAlert';
import PurchaseService from '../services/PurchaseService';
import AdService from '../services/AdService';

// Disable console logs in production
if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const FREE_SWIPES_LIMIT = 50;
const BONUS_SWIPES_AFTER_AD = 20;
const SWIPE_COUNT_KEY = '@CleanSwipe:swipeCount';
const BONUS_SWIPES_KEY = '@CleanSwipe:bonusSwipes';
const IS_PRO_KEY = '@CleanSwipe:isPro';
const HAS_SEEN_DELETE_INFO_KEY = '@CleanSwipe:hasSeenDeleteInfo';

export default function GalleryScreen({ selectedYear, selectedMonth, onBack, onPhotoDeleted, onPhotoRestored, onViewDeleted, deletedPhotosCount }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
  const [keptCount, setKeptCount] = useState(0);
  const [favoritedCount, setFavoritedCount] = useState(0);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [undoStack, setUndoStack] = useState([]); // Stack of actions for undo
  const [undoTimeout, setUndoTimeout] = useState(null);
  const [swipeCount, setSwipeCount] = useState(0);
  const [bonusSwipes, setBonusSwipes] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [hasSeenDeleteInfo, setHasSeenDeleteInfo] = useState(false);
  const [endCursor, setEndCursor] = useState(null);
  const [hasMorePhotos, setHasMorePhotos] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadAttemptsRef = useRef(0); // Track loading attempts to prevent infinite loops
  
  // Custom alert state
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    emoji: '✨',
    buttons: []
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await loadSwipeCount();
    await loadBonusSwipes();
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

  const loadBonusSwipes = async () => {
    try {
      const bonus = await AsyncStorage.getItem(BONUS_SWIPES_KEY);
      if (bonus !== null) {
        setBonusSwipes(parseInt(bonus, 10));
      }
    } catch (error) {
      console.error('Error loading bonus swipes:', error);
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
      `Photos you delete are moved to your phone's Recently Deleted album (iOS) or Trash (Android).\n\nYou can recover them within 30 days before they're permanently removed.`,
      [
        {
          text: 'Got it!',
          style: 'default',
          onPress: async () => {
            try {
              await AsyncStorage.setItem(HAS_SEEN_DELETE_INFO_KEY, 'true');
              setHasSeenDeleteInfo(true);
            } catch (error) {
              console.error('Error saving delete info status:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const incrementSwipeCount = async () => {
    // Use bonus swipes first
    if (bonusSwipes > 0) {
      const newBonus = bonusSwipes - 1;
      setBonusSwipes(newBonus);
      try {
        await AsyncStorage.setItem(BONUS_SWIPES_KEY, newBonus.toString());
      } catch (error) {
        console.error('Error saving bonus swipes:', error);
      }
      return;
    }

    const newCount = swipeCount + 1;
    setSwipeCount(newCount);
    try {
      await AsyncStorage.setItem(SWIPE_COUNT_KEY, newCount.toString());
    } catch (error) {
      console.error('Error saving swipe count:', error);
    }

    // Show rewarded ad every 50 swipes for free users
    if (!isPro && newCount % 50 === 0 && newCount > 0) {
      console.log(`📺 Showing rewarded ad after ${newCount} swipes`);
      
      setAlertConfig({
        visible: true,
        title: 'Watch Ad for 20 More Swipes!',
        message: 'Watch a short video to get 20 bonus swipes.',
        emoji: '🎁',
        buttons: [
          {
            text: 'Maybe Later',
            style: 'secondary',
          },
          {
            text: 'Watch Video',
            style: 'primary',
            onPress: async () => {
              const rewarded = await AdService.showRewardedAd();
              if (rewarded) {
                // Grant 20 bonus swipes
                const newBonus = bonusSwipes + BONUS_SWIPES_AFTER_AD;
                setBonusSwipes(newBonus);
                try {
                  await AsyncStorage.setItem(BONUS_SWIPES_KEY, newBonus.toString());
                } catch (error) {
                  console.error('Error saving bonus swipes:', error);
                }
                
                setAlertConfig({
                  visible: true,
                  title: 'Bonus Unlocked!',
                  message: `You earned ${BONUS_SWIPES_AFTER_AD} bonus swipes!`,
                  emoji: '🎉',
                  buttons: [{ text: 'Awesome!', style: 'primary' }]
                });
              } else {
                console.log('⚠️ Ad not ready or not watched completely');
              }
            },
          },
        ]
      });
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
    // Check if we're filtering by month (used throughout function)
    const isFilteringByMonth = selectedYear !== undefined && selectedMonth !== undefined;
    
    try {
      if (!loadMore) {
        console.log('⚡ Initial load...');
        if (isFilteringByMonth) {
          console.log(`📅 Loading photos for ${selectedYear}-${selectedMonth + 1}`);
        }
      }
      
      // Don't show loading screen - just load in background!
      if (!loadMore && photos.length === 0) {
        setLoading(true); // Only show loading if NO photos yet
      } else {
        setIsLoadingMore(true);
      }

      // SMART LOADING: If filtering by month, use date range for INSTANT results!
      let album;
      
      if (isFilteringByMonth) {
        // Calculate date range for the selected month
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);
        
        if (!loadMore) {
          console.log(`📅 Using date range: ${startOfMonth.toISOString()} to ${endOfMonth.toISOString()}`);
        }
        
        // Load ALL photos from this month using pagination (videos optional)
        album = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo', // Only photos for speed
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          createdAfter: startOfMonth.getTime(),
          createdBefore: endOfMonth.getTime(),
          first: 500, // Load 500 at a time
          after: loadMore ? endCursor : undefined,
        });
        
        if (!loadMore) {
          console.log(`✅ Found ${album.assets.length} photos in ${selectedYear}-${selectedMonth + 1} (hasMore: ${album.hasNextPage})`);
        }
      } else {
        // Regular loading for "All Photos" or pagination
        const batchSize = 10;
        
        album = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo', // Only photos for speed
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          first: batchSize,
          after: loadMore ? endCursor : undefined,
        });
      }
      
      // Filter out invalid dates (like January 1970)
      album.assets = album.assets.filter(asset => {
        const date = new Date(asset.creationTime);
        return date.getFullYear() >= 2000 && !isNaN(date.getTime());
      });

      if (album.assets.length === 0 && !loadMore) {
        const monthName = isFilteringByMonth 
          ? new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : '';
        
        Alert.alert(
          'No Photos Found',
          isFilteringByMonth 
            ? `No photos found in ${monthName}.`
            : 'No photos found in your gallery!',
          [{ text: 'OK', onPress: () => isFilteringByMonth ? onBack() : setLoading(false) }]
        );
        setLoading(false);
        return;
      }

      // Add to existing photos (progressive loading!)
      if (loadMore) {
        setPhotos(prev => [...prev, ...album.assets]);
      } else {
        setPhotos(album.assets);
      }

      setEndCursor(album.endCursor);
      setHasMorePhotos(album.hasNextPage);
      setLoading(false);
      setIsLoadingMore(false);
      
      // Auto-load more photos if we have more available
      if (!loadMore && album.hasNextPage) {
        const currentTotal = loadMore ? photos.length + album.assets.length : album.assets.length;
        
        // For month filtering, load all photos immediately
        if (isFilteringByMonth) {
          console.log(`🔄 Loading more photos from month... (current: ${currentTotal})`);
          setTimeout(() => loadPhotos(true), 100);
        } 
        // For all photos, preload if less than 20
        else if (currentTotal < 20) {
          console.log('🔄 Preloading next batch...');
          setTimeout(() => loadPhotos(true), 300);
        }
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

  const handleDelete = useCallback(async () => {
    // Check if user has reached free limit
    if (!isPro && swipeCount >= FREE_SWIPES_LIMIT && bonusSwipes === 0) {
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

      // Mark photo as deleted (moved to app's recycle bin)
      // NOT actually deleting from device yet - user can review later
      console.log('🗑️ Moving photo to recycle bin...');
      photoToDelete.deletedAt = new Date().toISOString();
      console.log('✅ Photo moved to recycle bin!');
      
      // Add to undo stack
      setUndoStack(prev => [...prev, {
        type: 'delete',
        photo: photoToDelete,
        index: currentIndex
      }]);

      // Remove photo from array
      const updatedPhotos = [...photos];
      updatedPhotos.splice(currentIndex, 1);
      setPhotos(updatedPhotos);
      
      setDeletedPhotos([...deletedPhotos, { ...photoToDelete, index: currentIndex }]);
      setDeletedCount(deletedCount + 1);
      
      // Notify parent app about deleted photo
      if (onPhotoDeleted) {
        onPhotoDeleted(photoToDelete);
      }
      
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
  }, [isPro, swipeCount, bonusSwipes, currentIndex, photos, hasSeenDeleteInfo]);

  const handleKeep = useCallback(async () => {
    // Check if user has reached free limit
    if (!isPro && swipeCount >= FREE_SWIPES_LIMIT && bonusSwipes === 0) {
      setShowPaywall(true);
      return;
    }

    if (currentIndex >= photos.length) return;

    const currentPhoto = photos[currentIndex];
    
    // Add to undo stack
    setUndoStack(prev => [...prev, {
      type: 'keep',
      photo: currentPhoto,
      index: currentIndex
    }]);

    setKeptCount(keptCount + 1);
    setCurrentIndex(currentIndex + 1);
    await incrementSwipeCount();

    // Load more photos if getting close to the end
    await checkAndLoadMore();
  }, [isPro, swipeCount, bonusSwipes, currentIndex, photos, keptCount]);

  const handleFavorite = useCallback(async () => {
    // Check if user has reached free limit
    if (!isPro && swipeCount >= FREE_SWIPES_LIMIT && bonusSwipes === 0) {
      setShowPaywall(true);
      return;
    }

    if (currentIndex >= photos.length) return;

    const currentPhoto = photos[currentIndex];
    
    try {
      console.log('❤️ Adding to favorites:', currentPhoto.id);
      
      // Get all albums
      const albums = await MediaLibrary.getAlbumsAsync();
      
      // Find or create Favorites album
      let favoritesAlbum = albums.find(album => 
        album.title === 'CleanSwipe Favorites' ||
        album.title.toLowerCase() === 'favorites' || 
        album.title.toLowerCase() === 'favourite'
      );
      
      if (!favoritesAlbum) {
        console.log('📁 Creating CleanSwipe Favorites album...');
        favoritesAlbum = await MediaLibrary.createAlbumAsync('CleanSwipe Favorites', currentPhoto, false);
        console.log('✅ Created album and added photo!');
      } else {
        console.log('📁 Adding to existing album:', favoritesAlbum.title);
        await MediaLibrary.addAssetsToAlbumAsync([currentPhoto], favoritesAlbum, false);
        console.log('✅ Added to album!');
      }
      
      // Show success message
      setAlertConfig({
        visible: true,
        title: 'Added to Favorites!',
        message: `Photo added to "${favoritesAlbum.title}" album in your gallery.`,
        emoji: '❤️',
        buttons: [{ text: 'OK', style: 'primary' }]
      });

      // Add to undo stack
      setUndoStack(prev => [...prev, {
        type: 'favorite',
        photo: currentPhoto,
        index: currentIndex
      }]);

      setFavoritedCount(favoritedCount + 1);
      setCurrentIndex(currentIndex + 1);
      await incrementSwipeCount();
      await checkAndLoadMore();
    } catch (error) {
      console.error('❌ Error favoriting photo:', error);
      setAlertConfig({
        visible: true,
        title: 'Could Not Add to Favorites',
        message: `There was an issue adding this photo to favorites.\n\nNote: On Android, photos are added to "CleanSwipe Favorites" album.`,
        emoji: '⚠️',
        buttons: [
          { 
            text: 'Skip', 
            style: 'secondary',
            onPress: async () => {
              setCurrentIndex(currentIndex + 1);
              await incrementSwipeCount();
              await checkAndLoadMore();
            }
          },
          { 
            text: 'Retry', 
            style: 'primary',
            onPress: () => handleFavorite() 
          }
        ]
      });
    }
  }, [isPro, swipeCount, bonusSwipes, currentIndex, photos, favoritedCount]);

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

  const handleUndo = useCallback(async () => {
    if (undoStack.length === 0) return;

    // Get last action from stack
    const lastAction = undoStack[undoStack.length - 1];
    const { type, photo } = lastAction;

    // Remove from stack
    setUndoStack(prev => prev.slice(0, -1));

    // Insert photo back at current position
    const updatedPhotos = [...photos];
    updatedPhotos.splice(currentIndex, 0, photo);
    setPhotos(updatedPhotos);

    // Undo the count based on action type
    if (type === 'delete') {
      setDeletedCount(prev => Math.max(0, prev - 1));
      setDeletedPhotos(prev => prev.filter(p => p.id !== photo.id));
      
      // Notify parent that photo was restored
      if (onPhotoRestored) {
        onPhotoRestored(photo);
      }
      
      console.log('↶ Undone delete');
    } else if (type === 'keep') {
      setKeptCount(prev => Math.max(0, prev - 1));
      console.log('↶ Undone keep');
    } else if (type === 'favorite') {
      setFavoritedCount(prev => Math.max(0, prev - 1));
      console.log('↶ Undone favorite');
    }

    // Undo the swipe/bonus count
    if (bonusSwipes > 0) {
      const newBonus = bonusSwipes + 1;
      setBonusSwipes(newBonus);
      try {
        await AsyncStorage.setItem(BONUS_SWIPES_KEY, newBonus.toString());
      } catch (error) {
        console.error('Error updating bonus swipes:', error);
      }
    } else {
      const newCount = Math.max(0, swipeCount - 1);
      setSwipeCount(newCount);
      try {
        await AsyncStorage.setItem(SWIPE_COUNT_KEY, newCount.toString());
      } catch (error) {
        console.error('Error updating swipe count:', error);
      }
    }
  }, [undoStack, photos, currentIndex, swipeCount, bonusSwipes]);

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
  const isSearchingMonth = selectedYear !== undefined && selectedMonth !== undefined;
  const monthName = isSearchingMonth 
    ? new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingEmoji}>📸</Text>
          <Text style={styles.loadingText}>
            {isSearchingMonth ? `Finding photos from ${monthName}...` : 'Loading your photos...'}
          </Text>
          <Text style={styles.loadingSubtext}>
            {isSearchingMonth ? 'Searching through your gallery' : 'This may take a moment'}
          </Text>
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

  // Show profile screen
  if (showProfile) {
    return (
      <ProfileScreen 
        onClose={() => setShowProfile(false)}
        onSubscribe={async () => {
          await loadProStatus();
          setShowProfile(false);
        }}
      />
    );
  }

  // Show paywall if limit reached
  if (showPaywall) {
    return <PaywallScreen swipesUsed={swipeCount} onUpgrade={handleUpgrade} />;
  }

  // Show "no more photos" when done
  if (!currentPhoto && photos.length > 0) {
    return (
      <View style={styles.container}>
        <TopPanel 
          deletedCount={deletedPhotosCount || deletedCount} 
          onUndo={handleUndo} 
          canUndo={undoStack.length > 0}
          swipesRemaining={isPro ? '∞' : (bonusSwipes > 0 ? `${bonusSwipes} bonus` : Math.max(0, FREE_SWIPES_LIMIT - swipeCount))}
          isPro={isPro}
          onBack={onBack}
          onViewDeleted={onViewDeleted}
        />
        <View style={styles.centerContent}>
          <Text style={styles.messageText}>🎉</Text>
          <Text style={styles.messageTitle}>All Done!</Text>
          <Text style={styles.messageSubtitle}>
            {isSearchingMonth 
              ? `No more photos in ${monthName}`
              : 'You\'ve reviewed all your photos'}
          </Text>
          <Text style={styles.statsText}>
            Deleted: {deletedCount} • Kept: {keptCount} • Favorited: {favoritedCount}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopPanel 
        deletedCount={deletedPhotosCount || deletedCount} 
        onUndo={handleUndo} 
        canUndo={undoStack.length > 0}
        swipesRemaining={isPro ? '∞' : (bonusSwipes > 0 ? `${bonusSwipes} bonus` : Math.max(0, FREE_SWIPES_LIMIT - swipeCount))}
        isPro={isPro}
        onBack={onBack}
        onViewDeleted={onViewDeleted}
        onOpenProfile={() => setShowProfile(true)}
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
        
        {/* Silent background loading - no UI indicator */}
      </View>

      <BottomActions 
        onDelete={handleDelete} 
        onKeep={handleKeep}
        onFavorite={handleFavorite}
      />
      
      {/* Banner Ad - only show for free users */}
      {!isPro && <BannerAdComponent style={styles.bannerAd} />}

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        emoji={alertConfig.emoji}
        buttons={alertConfig.buttons}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
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
  loadingEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  loadingSubtext: {
    color: '#AAAAAA',
    fontSize: 16,
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
  bannerAd: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
