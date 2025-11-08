import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function TopPanel({ deletedCount, onUndo, canUndo, swipesRemaining, isPro, onBack, onViewDeleted, onOpenProfile }) {
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

        <View style={styles.rightSection}>
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
          
          {onOpenProfile && (
            <TouchableOpacity
              style={styles.profileButton}
              onPress={onOpenProfile}
              activeOpacity={0.7}
            >
              <Text style={styles.profileIcon}>{isPro ? '✨' : '👤'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#000000',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
  },
  backText: {
    color: '#4CAF50',
    fontSize: 17,
    fontWeight: '600',
  },
  leftSection: {
    gap: 6,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  counterLabel: {
    color: '#999999',
    fontSize: 15,
    fontWeight: '500',
  },
  counterValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  swipesContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  swipesLabel: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  undoButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  undoButtonDisabled: {
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    shadowOpacity: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  undoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  undoTextDisabled: {
    color: '#555555',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileIcon: {
    fontSize: 20,
  },
});
