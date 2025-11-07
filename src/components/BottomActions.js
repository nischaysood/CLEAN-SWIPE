import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function BottomActions({ onDelete, onKeep, onFavorite }) {
  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  favoriteButton: {
    backgroundColor: '#FF6B81',
  },
  keepButton: {
    backgroundColor: '#4CAF50',
  },
  buttonIcon: {
    fontSize: 22,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
