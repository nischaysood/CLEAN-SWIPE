import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import MonthSelectorScreen from './src/screens/MonthSelectorScreen';
import GalleryScreen from './src/screens/GalleryScreen';

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showGallery, setShowGallery] = useState(false);

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

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {showGallery ? (
          <GalleryScreen
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onBack={handleBackToMonthSelector}
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
