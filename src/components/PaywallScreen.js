import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function PaywallScreen({ swipesUsed, onUpgrade }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🚀</Text>
        
        <Text style={styles.title}>Free Limit Reached!</Text>
        
        <Text style={styles.subtitle}>
          You've used all {swipesUsed} free swipes
        </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>Unlimited swipes</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>Priority support</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>Advanced features</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>AI-powered cleanup (coming soon)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
          <Text style={styles.priceText}>$4.99/month</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Payment integration coming soon
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 24,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  disclaimer: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
