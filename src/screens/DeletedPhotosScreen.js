import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = (width - 48) / COLUMN_COUNT;

export default function DeletedPhotosScreen({ deletedPhotos, onRestore, onPermanentDelete, onBack }) {
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const toggleSelect = (photoId) => {
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(selectedPhotos.filter(id => id !== photoId));
    } else {
      setSelectedPhotos([...selectedPhotos, photoId]);
    }
  };

  const handleRestoreSelected = () => {
    if (selectedPhotos.length === 0) {
      Alert.alert('No Photos Selected', 'Please select photos to restore.');
      return;
    }

    Alert.alert(
      'Restore Photos',
      `Restore ${selectedPhotos.length} photo(s) back to your gallery?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: () => {
            onRestore(selectedPhotos);
            setSelectedPhotos([]);
          }
        }
      ]
    );
  };

  const handleDeletePermanently = async () => {
    if (selectedPhotos.length === 0) {
      Alert.alert('No Photos Selected', 'Please select photos to delete.');
      return;
    }

    Alert.alert(
      '⚠️ Permanent Delete',
      `Permanently delete ${selectedPhotos.length} photo(s) from your device?\n\nThis CANNOT be undone!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            try {
              // Get photo IDs for the selected photos
              const photosToDelete = deletedPhotos.filter(p => selectedPhotos.includes(p.id));
              const photoIds = photosToDelete.map(p => p.id);
              
              // Actually delete from device
              await MediaLibrary.deleteAssetsAsync(photoIds);
              
              onPermanentDelete(selectedPhotos);
              setSelectedPhotos([]);
              
              Alert.alert('✅ Deleted', 'Photos permanently deleted from device.');
            } catch (error) {
              Alert.alert('Error', `Could not delete: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const renderPhoto = ({ item }) => {
    const isSelected = selectedPhotos.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.photoContainer}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.uri }}
          style={styles.photo}
          resizeMode="cover"
        />
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
        )}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {new Date(item.deletedAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🗑️ Deleted Photos</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {deletedPhotos.length} photo(s) • Tap to select
        </Text>
      </View>

      {/* Photo Grid */}
      {deletedPhotos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🗑️</Text>
          <Text style={styles.emptyText}>No deleted photos</Text>
          <Text style={styles.emptySubtext}>
            Deleted photos will appear here instead of being removed from your device
          </Text>
        </View>
      ) : (
        <FlatList
          data={deletedPhotos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Action Buttons */}
      {selectedPhotos.length > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionButton, styles.restoreButton]}
            onPress={handleRestoreSelected}
          >
            <Text style={styles.actionButtonText}>
              ↶ Restore ({selectedPhotos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeletePermanently}
          >
            <Text style={styles.actionButtonText}>
              🗑️ Delete Forever ({selectedPhotos.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A',
  },
  infoText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 100,
  },
  photoContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  restoreButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
