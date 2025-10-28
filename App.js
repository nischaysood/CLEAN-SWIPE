import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import MonthSelectorScreen from './src/screens/MonthSelectorScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import DeletedPhotosScreen from './src/screens/DeletedPhotosScreen';
import PurchaseService from './src/services/PurchaseService';

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  // Start with gallery directly - skip month selector for speed!
  const [showGallery, setShowGallery] = useState(true);
  const [showDeletedPhotos, setShowDeletedPhotos] = useState(false);
  const [deletedPhotos, setDeletedPhotos] = useState([]);

  // Initialize RevenueCat on app start
  useEffect(() => {
    PurchaseService.initialize();
  }, []);

  const handleSelectMonth = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setShowGallery(true);
  };

  const handleBackToMonthSelector = () => {
    setShowGallery(false);
    setSelectedYear(null);
    setSelectedMonth(null);
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
