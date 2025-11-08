import { Platform } from 'react-native';
import mobileAds, { 
  InterstitialAd, 
  AdEventType, 
  TestIds 
} from 'react-native-google-mobile-ads';

// TODO: Replace with your actual AdMob Ad Unit IDs from Google AdMob console
const AD_UNIT_IDS = {
  ios: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-XXXXX/YYYYY', // Replace with your iOS Ad Unit ID
  android: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-XXXXX/ZZZZZ', // Replace with your Android Ad Unit ID
};

class AdService {
  constructor() {
    this.interstitialAd = null;
    this.isAdLoaded = false;
    this.isAdShowing = false;
    this.initialized = false;
  }

  /**
   * Initialize AdMob
   * Call this once when app starts
   */
  async initialize() {
    try {
      await mobileAds().initialize();
      this.initialized = true;
      console.log('✅ AdMob initialized successfully');
      
      // Preload first ad
      this.loadInterstitialAd();
    } catch (error) {
      console.error('❌ Error initializing AdMob:', error);
    }
  }

  /**
   * Load an interstitial ad (full-screen ad)
   */
  loadInterstitialAd() {
    try {
      const adUnitId = Platform.OS === 'ios' ? AD_UNIT_IDS.ios : AD_UNIT_IDS.android;
      
      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });

      // Set up event listeners
      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('✅ Interstitial ad loaded');
        this.isAdLoaded = true;
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('👋 User closed the ad');
        this.isAdShowing = false;
        this.isAdLoaded = false;
        
        // Preload next ad
        this.loadInterstitialAd();
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('❌ Ad failed to load:', error);
        this.isAdLoaded = false;
        
        // Try to load again after 30 seconds
        setTimeout(() => this.loadInterstitialAd(), 30000);
      });

      // Start loading the ad
      this.interstitialAd.load();
    } catch (error) {
      console.error('❌ Error loading interstitial ad:', error);
    }
  }

  /**
   * Show the interstitial ad
   * @returns {Promise<boolean>} - Whether ad was shown successfully
   */
  async showInterstitialAd() {
    try {
      if (!this.initialized) {
        console.warn('⚠️ AdMob not initialized');
        return false;
      }

      if (this.isAdShowing) {
        console.warn('⚠️ Ad is already showing');
        return false;
      }

      if (!this.isAdLoaded || !this.interstitialAd) {
        console.warn('⚠️ Ad not loaded yet');
        // Try to load it now
        this.loadInterstitialAd();
        return false;
      }

      console.log('📺 Showing interstitial ad...');
      this.isAdShowing = true;
      await this.interstitialAd.show();
      return true;
    } catch (error) {
      console.error('❌ Error showing ad:', error);
      this.isAdShowing = false;
      return false;
    }
  }

  /**
   * Check if ad is ready to show
   * @returns {boolean}
   */
  isAdReady() {
    return this.isAdLoaded && !this.isAdShowing;
  }
}

// Export singleton instance
export default new AdService();
