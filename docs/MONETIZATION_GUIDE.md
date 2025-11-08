# 💰 CleanSwipe Monetization Guide

## Overview

Your app uses a **Freemium + Ads** model:
- **Free users**: See ads every 50 swipes
- **Pro users**: $2.99/month - No ads, unlimited swipes

## How It Works

### 1. Ad Revenue (Google AdMob)

**What happens:**
- Every 50 swipes, free users see a skippable video ad
- You earn money when users watch or interact with ads
- Typical earnings: $5-$20 per 1000 ad views (CPM)

**Example earnings:**
- 1,000 users × 100 swipes each = 2,000 ads shown
- 2,000 ads × $10 CPM = $20 revenue

### 2. Subscription Revenue (RevenueCat + App Store/Play Store)

**What happens:**
- Users pay $2.99/month for Pro
- Apple/Google takes 30% commission (first year), 15% after
- You keep 70% = $2.09 per subscriber per month

**Example earnings:**
- 100 Pro subscribers × $2.09 = $209/month
- 1,000 Pro subscribers × $2.09 = $2,090/month

## Setup Steps

### Step 1: Google AdMob Setup (For Ads)

1. **Create AdMob Account**
   - Go to: https://admob.google.com
   - Sign in with Google account
   - Click "Get Started"

2. **Create Your App**
   - Click "Apps" → "Add App"
   - Select "Android" or "iOS"
   - Enter app name: "CleanSwipe"
   - Click "Add"

3. **Create Ad Units**
   - Click "Ad units" → "Add Ad Unit"
   - Select "Interstitial" (full-screen ad)
   - Name it: "CleanSwipe Interstitial"
   - Click "Create Ad Unit"
   - **Copy the Ad Unit ID** (looks like: ca-app-pub-1234567890/0987654321)

4. **Update Your Code**
   - Open `src/services/AdService.js`
   - Replace `ca-app-pub-XXXXX/YYYYY` with your iOS Ad Unit ID
   - Replace `ca-app-pub-XXXXX/ZZZZZ` with your Android Ad Unit ID
   
   - Open `app.json`
   - Replace `ca-app-pub-XXXXX~YYYYY` with your AdMob App ID (Android)
   - Replace `ca-app-pub-XXXXX~ZZZZZ` with your AdMob App ID (iOS)

5. **Test Ads**
   - In development, test ads show automatically
   - Real ads appear after app is published

### Step 2: RevenueCat Setup (For Subscriptions)

1. **Create RevenueCat Account**
   - Go to: https://www.revenuecat.com
   - Sign up for free
   - Create new project: "CleanSwipe"

2. **Add Your App**
   - Click "Apps" → "Add App"
   - Enter bundle ID: `com.nischaysood.cleanswipe`
   - Select platform (iOS/Android)

3. **Create Subscription Product**
   - Go to App Store Connect (iOS) or Play Console (Android)
   - Create in-app product:
     - Product ID: `cleanswipe_pro_monthly`
     - Price: $2.99/month
     - Type: Auto-renewable subscription

4. **Configure RevenueCat**
   - In RevenueCat dashboard:
   - Add your App Store Connect API key (iOS)
   - Add your Play Console service account (Android)
   - Create entitlement: "pro"
   - Link product: `cleanswipe_pro_monthly`

5. **Update Your Code**
   - Open `src/services/PurchaseService.js`
   - Replace `appl_YOUR_IOS_KEY_HERE` with your RevenueCat iOS API key
   - Replace `goog_YOUR_ANDROID_KEY_HERE` with your RevenueCat Android API key

### Step 3: Publish to App Stores

#### Google Play Store (Android)

1. **Create Developer Account**
   - Go to: https://play.google.com/console
   - Pay $25 one-time fee
   - Complete registration

2. **Create App**
   - Click "Create app"
   - Enter app details
   - Upload APK or AAB file

3. **Set Up Monetization**
   - Link AdMob account
   - Set up subscription pricing
   - Complete tax forms

4. **Submit for Review**
   - Fill out all required info
   - Submit for review (1-3 days)

#### Apple App Store (iOS)

1. **Create Developer Account**
   - Go to: https://developer.apple.com
   - Pay $99/year
   - Complete registration

2. **Create App in App Store Connect**
   - Go to: https://appstoreconnect.apple.com
   - Click "My Apps" → "+"
   - Enter app details

3. **Set Up In-App Purchase**
   - Go to "Features" → "In-App Purchases"
   - Create subscription: $2.99/month
   - Submit for review

4. **Submit App**
   - Upload build via Xcode or Transporter
   - Fill out all metadata
   - Submit for review (1-2 days)

## Revenue Projections

### Conservative Estimate (1,000 users)
- 900 free users × 100 swipes = 1,800 ads
- 1,800 ads × $8 CPM = **$14.40/month** (ads)
- 100 Pro users × $2.09 = **$209/month** (subscriptions)
- **Total: $223.40/month**

### Moderate Estimate (10,000 users)
- 8,000 free users × 100 swipes = 16,000 ads
- 16,000 ads × $10 CPM = **$160/month** (ads)
- 2,000 Pro users × $2.09 = **$4,180/month** (subscriptions)
- **Total: $4,340/month**

### Optimistic Estimate (100,000 users)
- 70,000 free users × 100 swipes = 140,000 ads
- 140,000 ads × $12 CPM = **$1,680/month** (ads)
- 30,000 Pro users × $2.09 = **$62,700/month** (subscriptions)
- **Total: $64,380/month**

## Tips to Maximize Revenue

### 1. Optimize Ad Placement
- Show ads at natural break points (every 50 swipes is good)
- Don't show too many ads (annoys users)
- Use rewarded ads for extra features

### 2. Increase Conversion to Pro
- Offer 7-day free trial
- Show value: "Save 2 hours cleaning your gallery!"
- Limited-time offers: "50% off first month"

### 3. Reduce Churn
- Send reminder before subscription renews
- Add new features regularly
- Excellent customer support

### 4. Marketing
- App Store Optimization (ASO)
- Social media marketing
- Influencer partnerships
- Reddit/ProductHunt launch

## Payment Timeline

### AdMob
- Payments: Monthly
- Threshold: $100 minimum
- Method: Bank transfer or check
- Timeline: 21 days after month end

### App Store (iOS)
- Payments: Monthly
- Threshold: None
- Method: Bank transfer
- Timeline: 45 days after month end

### Play Store (Android)
- Payments: Monthly
- Threshold: $10 minimum
- Method: Bank transfer
- Timeline: 15 days after month end

## Tax Considerations

- You'll need to report income
- Set aside 25-30% for taxes
- Get a business license (optional but recommended)
- Consider forming an LLC

## Important Notes

1. **Test Mode**: Ads and payments won't work until you publish
2. **Review Process**: Can take 1-7 days
3. **Rejections**: Common for first-time apps, just fix and resubmit
4. **Updates**: You can update pricing anytime
5. **Analytics**: Track everything in AdMob and RevenueCat dashboards

## Next Steps

1. ✅ Code is ready (ads implemented!)
2. ⏳ Create AdMob account and get Ad Unit IDs
3. ⏳ Create RevenueCat account and configure
4. ⏳ Update code with real IDs
5. ⏳ Rebuild app with production settings
6. ⏳ Submit to App Stores
7. ⏳ Start earning! 💰

## Support

- AdMob Help: https://support.google.com/admob
- RevenueCat Docs: https://docs.revenuecat.com
- App Store Connect: https://developer.apple.com/support
- Play Console: https://support.google.com/googleplay

---

**Your app is ready to make money!** Just follow the setup steps above and you'll be earning within a few weeks. 🚀
