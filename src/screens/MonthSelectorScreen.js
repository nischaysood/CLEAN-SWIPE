import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function MonthSelectorScreen({ onSelectMonth }) {
  const [loading, setLoading] = useState(true);
  const [monthsData, setMonthsData] = useState([]);

  useEffect(() => {
    loadPhotosByMonth();
  }, []);

  const loadPhotosByMonth = async () => {
    try {
      setLoading(true);
      
      // Get all photos
      const album = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
        first: 10000, // Get all photos
      });

      // Group photos by month
      const monthMap = {};
      
      for (const asset of album.assets) {
        const date = new Date(asset.creationTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = {
            key: monthKey,
            name: monthName,
            year: date.getFullYear(),
            month: date.getMonth(),
            count: 0,
            firstPhoto: asset,
          };
        }
        monthMap[monthKey].count++;
      }

      // Convert to array and sort by date (newest first)
      const monthsArray = Object.values(monthMap).sort((a, b) => {
        return b.key.localeCompare(a.key);
      });

      setMonthsData(monthsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error loading photos by month:', error);
      setLoading(false);
    }
  };

  const renderMonthItem = ({ item }) => (
    <TouchableOpacity
      style={styles.monthCard}
      onPress={() => onSelectMonth(item.year, item.month)}
      activeOpacity={0.7}
    >
      <View style={styles.monthInfo}>
        <Text style={styles.monthName}>{item.name}</Text>
        <Text style={styles.photoCount}>
          {item.count} {item.count === 1 ? 'photo' : 'photos'}
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading your gallery...</Text>
        </View>
      </View>
    );
  }

  if (monthsData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📸</Text>
          <Text style={styles.emptyTitle}>No Photos Found</Text>
          <Text style={styles.emptySubtitle}>
            Add some photos to your gallery to get started
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Month</Text>
        <Text style={styles.subtitle}>Choose which month's photos to clean up</Text>
      </View>

      <FlatList
        data={monthsData}
        renderItem={renderMonthItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  monthCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  monthInfo: {
    flex: 1,
  },
  monthName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  photoCount: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  arrow: {
    color: '#4CAF50',
    fontSize: 32,
    fontWeight: '300',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
  },
});
