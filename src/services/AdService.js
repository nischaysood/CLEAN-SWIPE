import { Platform } from 'react-native';
import mobileAds, { 
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  BannerAd,
  BannerAdSize,
  AdEventType, 
  TestIds 
} from 'react-native-google-mobile-ads';

// Ad Unit IDs
const AD_UNIT_IDS = {
  rewarded: {
    ios: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXX/YYYYY',
    android: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXX/ZZZZZ',
  },
  banner: {
    ios: __DEV__ ? TestIds.BANNER : 'ca-app-pub-XXXXX/YYYYY',
    android: __DEV__ ? TestIds.BANNER : 'ca-app-pub-XXXXX/ZZZZZ',
  },
};

class AdService {
  constructor() {
    this.rewardedAd = null;
    this.isRewardedAdLoaded = false;
    this.isAdShowing = false;
    this.initialized = false;
  }

  /**
   * Initialize AdMob
   */
  async initialize() {
    try {
      await mobileAds().initialize();
      this.initialized = true;
      console.log('✅ AdMob initialized successfully');
      
      // Preload first rewarded ad
      this.loadRewardedAd();
    } catch (error) {
      console.error('❌ Error initializing AdMob:', error);
    }
  }

  /**
   * Load a rewarded video ad
   */
  loadRewardedAd() {
    try {
      const adUnitId = Platform.OS === 'ios' ? AD_UNIT_IDS.rewarded.ios : AD_UNIT_IDS.rewarded.android;
      
      this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });

      // Set up event listeners
      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('✅ Rewarded ad loaded');
        this.isRewardedAdLoaded = true;
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('🎁 User earned reward:', reward);
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('👋 User closed rewarded ad');
        this.isAdShowing = false;
        this.isRewardedAdLoaded = false;
        
        // Preload next ad
        this.loadRewardedAd();
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('❌ Rewarded ad failed to load:', error);
        this.isRewardedAdLoaded = false;
        
        // Try to load again after 30 seconds
        setTimeout(() => this.loadRewardedAd(), 30000);
      });

      // Start loading the ad
      this.rewardedAd.load();
    } catch (error) {
      console.error('❌ Error loading rewarded ad:', error);
    }
  }

  /**
   * Show rewarded video ad
   * @returns {Promise<boolean>} - Whether user watched the ad and earned reward
   */
  async showRewardedAd() {
    return new Promise((resolve) => {
      try {
        if (!this.initialized) {
          console.warn('⚠️ AdMob not initialized');
          resolve(false);
          return;
        }

        if (this.isAdShowing) {
          console.warn('⚠️ Ad is already showing');
          resolve(false);
          return;
        }

        if (!this.isRewardedAdLoaded || !this.rewardedAd) {
          console.warn('⚠️ Rewarded ad not loaded yet');
          this.loadRewardedAd();
          resolve(false);
          return;
        }

        console.log('📺 Showing rewarded ad...');
        this.isAdShowing = true;

        // Listen for reward
        const rewardListener = this.rewardedAd.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            console.log('🎁 User earned reward!');
            resolve(true);
          }
        );

        // Listen for close without reward
        const closeListener = this.rewardedAd.addAdEventListener(
          AdEventType.CLOSED,
          () => {
            rewardListener();
            closeListener();
          }
        );

        this.rewardedAd.show();
      } catch (error) {
        console.error('❌ Error showing rewarded ad:', error);
        this.isAdShowing = false;
        resolve(false);
      }
    });
  }

  /**
   * Check if rewarded ad is ready
   */
  isRewardedAdReady() {
    return this.isRewardedAdLoaded && !this.isAdShowing;
  }

  /**
   * Get banner ad unit ID
   */
  getBannerAdUnitId() {
    return Platform.OS === 'ios' ? AD_UNIT_IDS.banner.ios : AD_UNIT_IDS.banner.android;
  }
}

// Export singleton instance
export default new AdService();
