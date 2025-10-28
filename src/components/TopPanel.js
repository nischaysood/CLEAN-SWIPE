import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function TopPanel({ deletedCount, onUndo, canUndo, swipesRemaining, isPro, onBack, onViewDeleted }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.counterContainer}
            onPress={onViewDeleted}
            activeOpacity={0.7}
          >
            <Text style={styles.counterLabel}>🗑️ Deleted</Text>
            <Text style={styles.counterValue}>{deletedCount}</Text>
          </TouchableOpacity>
          
          {swipesRemaining !== undefined && (
            <View style={styles.swipesContainer}>
              <Text style={styles.swipesLabel}>
                {isPro ? '✨ Pro' : `${swipesRemaining} left`}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.undoButton, !canUndo && styles.undoButtonDisabled]}
          onPress={onUndo}
          disabled={!canUndo}
          activeOpacity={0.7}
        >
          <Text style={[styles.undoText, !canUndo && styles.undoTextDisabled]}>
            ↶ Undo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#000000',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  backText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
  leftSection: {
    gap: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterLabel: {
    color: '#AAAAAA',
    fontSize: 16,
    fontWeight: '500',
  },
  counterValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  swipesContainer: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  swipesLabel: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '600',
  },
  undoButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  undoButtonDisabled: {
    backgroundColor: '#2A2A2A',
  },
  undoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  undoTextDisabled: {
    color: '#555555',
  },
});
