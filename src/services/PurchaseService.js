import { Platform, Alert } from 'react-native';

// RevenueCat API keys
const REVENUECAT_API_KEY_IOS = 'appl_YOUR_IOS_KEY_HERE'; // Add iOS key when ready
const REVENUECAT_API_KEY_ANDROID = 'goog_HGIjanorrHvafgaCgGunuxWRAEf';

// Try to import Purchases, but handle if native module not available
let Purchases = null;
try {
  Purchases = require('react-native-purchases').default;
} catch (error) {
  console.warn('⚠️ RevenueCat native module not available. Rebuild app with: eas build');
}

class PurchaseService {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize RevenueCat SDK
   * Call this once when app starts
   */
  async initialize() {
    // Check if native module is available
    if (!Purchases) {
      if (__DEV__) {
        console.warn('⚠️ RevenueCat not available - native module needs rebuild');
      }
      return;
    }

    try {
      const apiKey = Platform.OS === 'ios' 
        ? REVENUECAT_API_KEY_IOS 
        : REVENUECAT_API_KEY_ANDROID;

      // Skip if using placeholder keys
      if (apiKey.includes('YOUR_') || apiKey.includes('_KEY_HERE')) {
        if (__DEV__) {
          console.log('⚠️ RevenueCat: Using placeholder API keys, skipping initialization');
        }
        return;
      }

      await Purchases.configure({ apiKey });
      this.initialized = true;
      if (__DEV__) {
        console.log('✅ RevenueCat initialized successfully');
      }
      
      // Check initial subscription status
      const customerInfo = await Purchases.getCustomerInfo();
      if (__DEV__) {
        console.log('Customer info:', customerInfo.entitlements.active);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('⚠️ RevenueCat initialization failed (app will work without payments)');
      }
      // Don't throw - app should still work without payments
    }
  }

  /**
   * Get available subscription packages
   * Returns array of packages user can purchase
   */
  async getOfferings() {
    try {
      if (!Purchases || !this.initialized) {
        console.warn('RevenueCat not available or not initialized');
        return [];
      }

      const offerings = await Purchases.getOfferings();
      
      if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
        console.log('Available packages:', offerings.current.availablePackages.length);
        return offerings.current.availablePackages;
      }
      
      console.log('No offerings available');
      return [];
    } catch (error) {
      console.error('Error getting offerings:', error);
      return [];
    }
  }

  /**
   * Purchase a subscription package
   * @param {Package} packageToPurchase - The package to purchase
   * @returns {boolean} - Whether user has pro access after purchase
   */
  async purchasePackage(packageToPurchase) {
    try {
      if (!Purchases || !this.initialized) {
        throw new Error('RevenueCat not available or not initialized');
      }

      console.log('Attempting purchase...');
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      
      console.log('Purchase successful!');
      return this.checkProStatus(customerInfo);
    } catch (error) {
      if (error.userCancelled) {
        console.log('User cancelled purchase');
        return false;
      }
      
      console.error('Error purchasing:', error);
      throw error;
    }
  }

  /**
   * Check if user has Pro subscription
   * @param {CustomerInfo} customerInfo - Optional customer info (to avoid extra API call)
   * @returns {boolean} - Whether user has active pro subscription
   */
  async checkProStatus(customerInfo = null) {
    try {
      if (!Purchases || !this.initialized) {
        console.warn('RevenueCat not available or not initialized, returning false');
        return false;
      }

      if (!customerInfo) {
        customerInfo = await Purchases.getCustomerInfo();
      }
      
      // Check if user has active 'pro' entitlement
      const isPro = customerInfo.entitlements.active['pro'] !== undefined;
      console.log('Pro status:', isPro);
      return isPro;
    } catch (error) {
      console.error('Error checking pro status:', error);
      return false;
    }
  }

  /**
   * Restore previous purchases
   * Useful for users who reinstalled the app or switched devices
   * @returns {boolean} - Whether user has pro access after restore
   */
  async restorePurchases() {
    try {
      if (!Purchases || !this.initialized) {
        throw new Error('RevenueCat not available or not initialized');
      }

      console.log('Restoring purchases...');
      const { customerInfo } = await Purchases.restorePurchases();
      
      const isPro = this.checkProStatus(customerInfo);
      
      if (isPro) {
        Alert.alert(
          'Purchases Restored',
          'Your Pro subscription has been restored!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'No active subscriptions found to restore.',
          [{ text: 'OK' }]
        );
      }
      
      return isPro;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
      throw error;
    }
  }

  /**
   * Get current customer info
   * Useful for debugging or displaying subscription details
   */
  async getCustomerInfo() {
    try {
      if (!Purchases || !this.initialized) {
        return null;
      }
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('Error getting customer info:', error);
      return null;
    }
  }

  /**
   * Check if RevenueCat is properly configured
   * @returns {boolean}
   */
  isConfigured() {
    return Purchases !== null && this.initialized;
  }
}

// Export singleton instance
export default new PurchaseService();
