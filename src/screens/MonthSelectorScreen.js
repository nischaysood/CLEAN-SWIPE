import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
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
      
      // Fast loading: Get photos in batches and process incrementally
      const monthMap = {};
      let hasMore = true;
      let endCursor = null;
      const batchSize = 200; // Process 200 at a time for speed
      
      console.log('📅 Loading all months from gallery...');
      
      while (hasMore) {
        const album = await MediaLibrary.getAssetsAsync({
          mediaType: ['photo', 'video'],
          sortBy: [[MediaLibrary.SortBy.creationTime, false]],
          first: batchSize,
          after: endCursor,
        });

        // Process this batch
        for (const asset of album.assets) {
          const date = new Date(asset.creationTime);
          
          // Skip invalid dates (like January 1970)
          if (date.getFullYear() < 2000 || isNaN(date.getTime())) {
            continue;
          }
          
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthMap[monthKey]) {
            const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
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

        // Update UI with current progress (show months as we find them)
        const monthsArray = Object.values(monthMap).sort((a, b) => {
          return b.key.localeCompare(a.key);
        });
        setMonthsData(monthsArray);

        hasMore = album.hasNextPage;
        endCursor = album.endCursor;
        
        // Keep going until we've processed ALL photos
        if (!hasMore) {
          console.log(`✅ Found ${Object.keys(monthMap).length} months with photos`);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading photos by month:', error);
      setLoading(false);
    }
  };

  const renderMonthItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onSelectMonth(item.year, item.month)}
      activeOpacity={0.7}
    >
      <BlurView intensity={60} tint="dark" style={styles.monthCard}>
        <View style={styles.monthInfo}>
          <Text style={styles.monthName}>{item.name}</Text>
          <Text style={styles.photoCount}>
            {item.count} {item.count === 1 ? 'item' : 'items'}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </BlurView>
    </TouchableOpacity>
  );

  if (loading && monthsData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>📅</Text>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Organizing your photos...</Text>
          <Text style={styles.loadingSubtext}>This will only take a moment</Text>
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
        <Text style={styles.subtitle}>Choose which photos & videos to clean up</Text>
      </View>

      <FlatList
        data={monthsData}
        renderItem={renderMonthItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <TouchableOpacity
            onPress={() => onSelectMonth(undefined, undefined)}
            activeOpacity={0.7}
          >
            <BlurView intensity={80} tint="light" style={[styles.monthCard, styles.allPhotosCard]}>
              <View style={styles.monthInfo}>
                <Text style={styles.monthName}>🚀 All Photos</Text>
                <Text style={styles.photoCount}>Clean up your entire gallery</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </BlurView>
          </TouchableOpacity>
        }
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
    paddingBottom: 28,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#999999',
    fontSize: 17,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  monthCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.7)',
    borderRadius: 20,
    padding: 22,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  allPhotosCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: 'rgba(102, 187, 106, 0.5)',
    marginBottom: 24,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  monthInfo: {
    flex: 1,
  },
  monthName: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  photoCount: {
    color: '#999999',
    fontSize: 15,
    fontWeight: '500',
  },
  arrow: {
    color: '#4CAF50',
    fontSize: 36,
    fontWeight: '200',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  loadingSubtext: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubtitle: {
    color: '#999999',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '500',
  },
});
