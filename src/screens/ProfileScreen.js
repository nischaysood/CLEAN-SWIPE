import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PurchaseService from '../services/PurchaseService';

const SWIPE_COUNT_KEY = '@CleanSwipe:swipeCount';
const BONUS_SWIPES_KEY = '@CleanSwipe:bonusSwipes';
const IS_PRO_KEY = '@CleanSwipe:isPro';

export default function ProfileScreen({ onClose, onSubscribe }) {
  const [isPro, setIsPro] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);
  const [bonusSwipes, setBonusSwipes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load swipe counts
      const count = await AsyncStorage.getItem(SWIPE_COUNT_KEY);
      const bonus = await AsyncStorage.getItem(BONUS_SWIPES_KEY);
      const pro = await AsyncStorage.getItem(IS_PRO_KEY);
      
      setSwipeCount(count ? parseInt(count, 10) : 0);
      setBonusSwipes(bonus ? parseInt(bonus, 10) : 0);
      setIsPro(pro === 'true');

      // Check actual subscription status
      if (PurchaseService.isConfigured()) {
        const customerInfo = await PurchaseService.getCustomerInfo();
        if (customerInfo) {
          const proEntitlement = customerInfo.entitlements.active['pro'];
          if (proEntitlement) {
            setSubscriptionInfo({
              expiresDate: proEntitlement.expirationDate,
              willRenew: proEntitlement.willRenew,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleUpgrade = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (!PurchaseService.isConfigured()) {
        Alert.alert(
          'Coming Soon',
          'Subscription system is being set up. For now, enjoy the app!',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      const packages = await PurchaseService.getOfferings();
      
      if (packages.length === 0) {
        Alert.alert(
          'No Subscriptions Available',
          'Unable to load subscription options. Please try again later.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Find monthly package
      const monthlyPackage = packages.find(pkg => 
        pkg.identifier.includes('monthly') || pkg.packageType === 'MONTHLY'
      ) || packages[0];

      Alert.alert(
        '✨ Upgrade to Pro',
        `Get unlimited swipes and remove all ads for just $${monthlyPackage.product.price}/month!\n\n✓ Unlimited swipes\n✓ No ads\n✓ Cancel anytime`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
          {
            text: 'Subscribe',
            onPress: async () => {
              try {
                const success = await PurchaseService.purchasePackage(monthlyPackage);
                if (success) {
                  await AsyncStorage.setItem(IS_PRO_KEY, 'true');
                  setIsPro(true);
                  Alert.alert(
                    '🎉 Welcome to Pro!',
                    'You now have unlimited swipes and no ads!',
                    [{ text: 'Awesome!', onPress: () => onClose() }]
                  );
                  if (onSubscribe) onSubscribe();
                }
              } catch (error) {
                Alert.alert(
                  'Purchase Failed',
                  error.message || 'Unable to complete purchase. Please try again.',
                  [{ text: 'OK' }]
                );
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error upgrading:', error);
      Alert.alert('Error', 'Unable to load subscription options.', [{ text: 'OK' }]);
      setLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const restored = await PurchaseService.restorePurchases();
      if (restored) {
        await AsyncStorage.setItem(IS_PRO_KEY, 'true');
        setIsPro(true);
        await loadUserData();
        if (onSubscribe) onSubscribe();
      }
    } catch (error) {
      // Error already shown in PurchaseService
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = () => {
    const url = Platform.OS === 'ios'
      ? 'https://apps.apple.com/account/subscriptions'
      : 'https://play.google.com/store/account/subscriptions';
    
    Alert.alert(
      'Manage Subscription',
      `To manage or cancel your subscription, go to your ${Platform.OS === 'ios' ? 'App Store' : 'Play Store'} account settings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openURL(url) },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pro Status Card */}
        <View style={[styles.card, isPro && styles.proCard]}>
          <Text style={styles.cardEmoji}>{isPro ? '✨' : '🆓'}</Text>
          <Text style={styles.cardTitle}>
            {isPro ? 'Pro Member' : 'Free Plan'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {isPro 
              ? 'Unlimited swipes • No ads' 
              : `${50 - swipeCount} swipes left • ${bonusSwipes} bonus`}
          </Text>
          
          {isPro && subscriptionInfo && (
            <Text style={styles.subscriptionInfo}>
              {subscriptionInfo.willRenew 
                ? `Renews on ${formatDate(subscriptionInfo.expiresDate)}`
                : `Expires on ${formatDate(subscriptionInfo.expiresDate)}`}
            </Text>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{swipeCount}</Text>
            <Text style={styles.statLabel}>Total Swipes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{bonusSwipes}</Text>
            <Text style={styles.statLabel}>Bonus Swipes</Text>
          </View>
        </View>

        {/* Actions */}
        {!isPro ? (
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={handleUpgrade}
            disabled={loading}
          >
            <Text style={styles.upgradeButtonText}>
              {loading ? 'Loading...' : '✨ Upgrade to Pro - $2.99/month'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.manageButton}
            onPress={handleManageSubscription}
          >
            <Text style={styles.manageButtonText}>Manage Subscription</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.restoreButton}
          onPress={handleRestorePurchases}
          disabled={loading}
        >
          <Text style={styles.restoreButtonText}>
            {loading ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Pro</Text>
          <Text style={styles.infoText}>
            • Unlimited swipes{'\n'}
            • No banner ads{'\n'}
            • No rewarded video ads{'\n'}
            • Support development{'\n'}
            • Cancel anytime
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Privacy</Text>
          <Text style={styles.infoText}>
            Your photos never leave your device. We don't upload, store, or access your photos. Everything happens locally on your phone.
          </Text>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  proCard: {
    backgroundColor: '#4CAF50',
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
  },
  subscriptionInfo: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 12,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statValue: {
    color: '#4CAF50',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  manageButton: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  restoreButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  restoreButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    color: '#AAAAAA',
    fontSize: 15,
    lineHeight: 22,
  },
  version: {
    color: '#555555',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
});
