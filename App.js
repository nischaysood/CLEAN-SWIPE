import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PermissionScreen from './src/screens/PermissionScreen';
import MonthSelectorScreen from './src/screens/MonthSelectorScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import DeletedPhotosScreen from './src/screens/DeletedPhotosScreen';
import PurchaseService from './src/services/PurchaseService';
import AdService from './src/services/AdService';

const PERMISSION_GRANTED_KEY = '@CleanSwipe:permissionGranted';

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState(undefined);
  const [selectedYear, setSelectedYear] = useState(undefined);
  const [showGallery, setShowGallery] = useState(false);
  const [showDeletedPhotos, setShowDeletedPhotos] = useState(false);
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  // Check permission on app start
  useEffect(() => {
    checkPermission();
    initServices();
  }, []);

  const checkPermission = async () => {
    try {
      // Check if permission was previously granted
      const wasGranted = await AsyncStorage.getItem(PERMISSION_GRANTED_KEY);
      
      // Check current permission status
      const { status } = await MediaLibrary.getPermissionsAsync();
      
      if (status === 'granted') {
        console.log('✅ Permission already granted');
        setPermissionGranted(true);
        await AsyncStorage.setItem(PERMISSION_GRANTED_KEY, 'true');
      } else if (wasGranted === 'true') {
        // Was granted before but not now - user might have revoked
        console.log('⚠️ Permission was granted but now revoked');
        setPermissionGranted(false);
      } else {
        // First time - show permission screen
        console.log('📱 First time - need to request permission');
        setPermissionGranted(false);
      }
    } catch (error) {
      console.error('Error checking permission:', error);
      setPermissionGranted(false);
    } finally {
      setCheckingPermission(false);
    }
  };

  const initServices = async () => {
    try {
      await PurchaseService.initialize();
    } catch (error) {
      console.error('Failed to initialize PurchaseService:', error);
    }
    
    try {
      await AdService.initialize();
    } catch (error) {
      console.error('Failed to initialize AdService:', error);
    }
  };

  const handlePermissionGranted = async () => {
    console.log('✅ Permission granted in app!');
    await AsyncStorage.setItem(PERMISSION_GRANTED_KEY, 'true');
    setPermissionGranted(true);
  };

  const handleSelectMonth = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setShowGallery(true);
  };

  const handleBackToMonthSelector = () => {
    setShowGallery(false);
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
  };

  const handleViewDeletedPhotos = () => {
    setShowDeletedPhotos(true);
    setShowGallery(false);
  };

  const handleBackToGallery = () => {
    setShowDeletedPhotos(false);
    setShowGallery(true);
  };

  const handlePhotoDeleted = (photo) => {
    setDeletedPhotos(prev => [...prev, photo]);
  };

  const handleRestorePhotos = (photoIds) => {
    // Remove from deleted photos
    setDeletedPhotos(prev => prev.filter(p => !photoIds.includes(p.id)));
    // Photos will be restored in GalleryScreen
  };

  const handlePermanentDelete = (photoIds) => {
    // Remove from deleted photos list
    setDeletedPhotos(prev => prev.filter(p => !photoIds.includes(p.id)));
  };

  // Show loading while checking permission
  if (checkingPermission) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.container} />
      </GestureHandlerRootView>
    );
  }

  // Show permission screen if not granted
  if (!permissionGranted) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />
        <PermissionScreen onPermissionGranted={handlePermissionGranted} />
      </GestureHandlerRootView>
    );
  }

  // Show main app
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {showDeletedPhotos ? (
          <DeletedPhotosScreen
            deletedPhotos={deletedPhotos}
            onRestore={handleRestorePhotos}
            onPermanentDelete={handlePermanentDelete}
            onBack={handleBackToGallery}
          />
        ) : showGallery ? (
          <GalleryScreen
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onBack={handleBackToMonthSelector}
            onPhotoDeleted={handlePhotoDeleted}
            onViewDeleted={handleViewDeletedPhotos}
            deletedPhotosCount={deletedPhotos.length}
          />
        ) : (
          <MonthSelectorScreen onSelectMonth={handleSelectMonth} />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
