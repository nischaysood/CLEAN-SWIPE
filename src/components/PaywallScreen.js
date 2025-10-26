import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import PurchaseService from '../services/PurchaseService';

export default function PaywallScreen({ swipesUsed, onUpgrade }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const availablePackages = await PurchaseService.getOfferings();
      setPackages(availablePackages);
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    // If RevenueCat not configured or no packages, use fake upgrade
    if (!PurchaseService.isConfigured() || packages.length === 0) {
      Alert.alert(
        'Demo Mode',
        'RevenueCat is not configured yet. This will grant Pro access for testing.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: onUpgrade }
        ]
      );
      return;
    }

    try {
      setPurchasing(true);
      
      // Purchase the first package (monthly subscription)
      const isPro = await PurchaseService.purchasePackage(packages[0]);
      
      if (isPro) {
        Alert.alert(
          'Welcome to Pro! 🎉',
          'You now have unlimited swipes. Thank you for your support!',
          [{ text: 'Start Swiping!', onPress: onUpgrade }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Purchase Failed',
        'Unable to complete purchase. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);
      const isPro = await PurchaseService.restorePurchases();
      if (isPro) {
        onUpgrade();
      }
    } catch (error) {
      // Error already shown in PurchaseService
    } finally {
      setPurchasing(false);
    }
  };

  const getPrice = () => {
    if (packages.length > 0 && packages[0].product) {
      return packages[0].product.priceString || '$4.99/month';
    }
    return '$4.99/month';
  };

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
          style={[styles.upgradeButton, (loading || purchasing) && styles.buttonDisabled]}
          onPress={handlePurchase}
          activeOpacity={0.8}
          disabled={loading || purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
              <Text style={styles.priceText}>{getPrice()}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={purchasing}
        >
          <Text style={styles.restoreText}>
            {purchasing ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>

        {!PurchaseService.isConfigured() && (
          <Text style={styles.disclaimer}>
            ⚠️ Payment system not configured yet
          </Text>
        )}
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
  buttonDisabled: {
    backgroundColor: '#3A7A3A',
    opacity: 0.7,
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
  restoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  restoreText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disclaimer: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
