import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function BottomActions({ onDelete, onKeep, onFavorite }) {
  return (
    <BlurView intensity={80} tint="dark" style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonIcon}>❌</Text>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.favoriteButton]}
          onPress={onFavorite}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonIcon}>❤️</Text>
          <Text style={styles.buttonText}>Favorite</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.keepButton]}
          onPress={onKeep}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonIcon}>✅</Text>
          <Text style={styles.buttonText}>Keep</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 24,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    borderColor: '#FF7070',
  },
  favoriteButton: {
    backgroundColor: '#FF6B81',
    borderColor: '#FF8FA3',
  },
  keepButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#66BB6A',
  },
  buttonIcon: {
    fontSize: 28,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
