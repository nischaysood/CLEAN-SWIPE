# 🚀 Play Store Launch Checklist

## ✅ Pre-Launch Setup (Do These BEFORE Launch)

### 1. Google AdMob Setup (CRITICAL - Do This First!)

#### Step 1: Create AdMob Account
1. Go to https://admob.google.com/
2. Sign in with your Google account
3. Click "Get Started" and complete account setup
4. Accept terms and conditions

#### Step 2: Create Your App in AdMob
1. Click "Apps" in left sidebar
2. Click "Add App"
3. Select "Android" as platform
4. Choose "Yes" if app is published (or "No" if first time)
5. Enter app name: **SwipeWipe** (or your app name)
6. Click "Add"
7. **SAVE YOUR APP ID** - looks like: `ca-app-pub-1234567890123456~1234567890`

#### Step 3: Create Ad Units
You need to create 2 ad units:

**Banner Ad Unit:**
1. In your app, click "Ad units" → "Add ad unit"
2. Select "Banner"
3. Name it: "Gallery Banner"
4. Click "Create ad unit"
5. **SAVE THE AD UNIT ID** - looks like: `ca-app-pub-1234567890123456/1234567890`

**Rewarded Video Ad Unit:**
1. Click "Add ad unit" again
2. Select "Rewarded"
3. Name it: "Bonus Swipes Reward"
4. Click "Create ad unit"
5. **SAVE THE AD UNIT ID** - looks like: `ca-app-pub-1234567890123456/0987654321`

#### Step 4: Update Your Code
Replace the test IDs in these files:

**File: `app.json`**
```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-YOUR_ACTUAL_APP_ID~XXXXXXXXXX",
      "iosAppId": "ca-app-pub-YOUR_ACTUAL_APP_ID~XXXXXXXXXX"
    }
  ]
]
```

**File: `src/services/AdService.js`**
```javascript
const AD_UNIT_IDS = {
  rewarded: {
    ios: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-YOUR_ID/YOUR_REWARDED_UNIT',
    android: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-YOUR_ID/YOUR_REWARDED_UNIT',
  },
  banner: {
    ios: __DEV__ ? TestIds.BANNER : 'ca-app-pub-YOUR_ID/YOUR_BANNER_UNIT',
    android: __DEV__ ? TestIds.BANNER : 'ca-app-pub-YOUR_ID/YOUR_BANNER_UNIT',
  },
};
```

---

### 2. RevenueCat Setup (For Subscriptions)

#### Step 1: Create RevenueCat Account
1. Go to https://www.revenuecat.com/
2. Sign up for free account
3. Create a new project: "SwipeWipe"

#### Step 2: Configure Android
1. In RevenueCat dashboard, go to "Project Settings" → "Google Play"
2. Follow instructions to link your Google Play Console
3. Upload service account JSON key
4. **SAVE YOUR ANDROID API KEY** - looks like: `goog_aBcDeFgHiJkLmNoPqRsTuVwXyZ`

#### Step 3: Create Product & Entitlement
1. Go to "Products" → "Add Product"
2. Product ID: `pro_monthly` (must match Play Console)
3. Go to "Entitlements" → "Add Entitlement"
4. Entitlement ID: `pro`
5. Attach product `pro_monthly` to entitlement `pro`

#### Step 4: Update Your Code
**File: `src/services/PurchaseService.js`**
```javascript
const REVENUECAT_API_KEY_ANDROID = 'goog_YOUR_ACTUAL_REVENUECAT_KEY';
```

---

### 3. Google Play Console Setup

#### Step 1: Create In-App Product
1. Go to Google Play Console
2. Select your app
3. Go to "Monetize" → "Subscriptions"
4. Click "Create subscription"
5. Product ID: `pro_monthly` (MUST match RevenueCat)
6. Name: "Pro Monthly"
7. Description: "Unlimited swipes and ad-free experience"
8. Price: $2.99/month
9. Billing period: 1 month
10. Click "Save" and "Activate"

---

## 🎯 How Real Ads Work

### Development vs Production

**In Development (`__DEV__ = true`):**
- Uses Google's test ad IDs
- Ads show instantly
- No real money involved
- Safe to click/watch unlimited times

**In Production (Released on Play Store):**
- Uses YOUR real ad unit IDs
- Real ads from advertisers
- You earn money when users watch/click
- Takes 1-2 hours after first launch for real ads to appear

### Ad Revenue Explained

**Banner Ads:**
- Show at bottom of gallery screen
- You earn: ~$0.10 - $0.50 per 1000 impressions (CPM)
- Example: 10,000 users viewing = $1-5/day

**Rewarded Video Ads:**
- Users watch 15-30 second video for bonus swipes
- You earn: ~$1 - $5 per 1000 views (eCPM)
- Example: 1,000 users watching = $1-5/day
- Higher revenue than banners!

### First 24 Hours After Launch
- Ads may show as "test ads" or blank
- This is NORMAL - Google is learning about your app
- Real ads start showing after 1-2 hours
- Full optimization takes 24-48 hours

### Ad Mediation (Optional - For Later)
Once you have users, you can add more ad networks:
- Facebook Audience Network
- AppLovin
- Unity Ads
- This increases competition = higher revenue

---

## 📋 Final Pre-Launch Checklist

### Code Updates Needed:
- [ ] Replace AdMob App ID in `app.json`
- [ ] Replace Banner Ad Unit ID in `AdService.js`
- [ ] Replace Rewarded Ad Unit ID in `AdService.js`
- [ ] Replace RevenueCat API key in `PurchaseService.js`
- [ ] Test that app builds successfully
- [ ] Test subscription flow (will work after Play Store review)

### Play Console Setup:
- [ ] Create subscription product `pro_monthly` at $2.99/month
- [ ] Add app screenshots (at least 2)
- [ ] Write app description
- [ ] Set content rating
- [ ] Add privacy policy URL
- [ ] Complete store listing

### Build & Upload:
```bash
# Build production APK/AAB
eas build --platform android --profile production

# After build completes, download and upload to Play Console
```

---

## 🚨 IMPORTANT NOTES

### About Test Ads
- NEVER click your own real ads - Google will ban your account!
- Always use test mode during development
- Only switch to real ads for production builds

### Subscription Testing
- Use Google Play's test accounts to test subscriptions
- Real subscriptions only work after app is published
- Test users won't be charged

### Revenue Expectations
**Realistic First Month:**
- 100 users: $5-20
- 1,000 users: $50-200
- 10,000 users: $500-2,000

**Revenue Mix:**
- 70% from ads (if most users are free)
- 30% from subscriptions (if 5-10% convert to Pro)

### Privacy & Compliance
- Your app already includes proper permissions
- Privacy policy should mention:
  - Photos stay on device (not uploaded)
  - AdMob shows personalized ads
  - RevenueCat processes payments
- Add privacy policy URL to Play Console

---

## 🎉 Launch Day Steps

1. **Morning of Launch:**
   - Update all API keys (AdMob, RevenueCat)
   - Build production version
   - Upload to Play Console
   - Submit for review

2. **After Approval (Usually 1-3 days):**
   - App goes live on Play Store
   - Monitor crash reports
   - Check ad impressions in AdMob dashboard
   - Check subscription analytics in RevenueCat

3. **First Week:**
   - Respond to user reviews
   - Monitor revenue in AdMob (updates daily)
   - Check subscription conversions
   - Fix any critical bugs

---

## 📊 Monitoring Your Revenue

### AdMob Dashboard
- Check daily: https://admob.google.com/
- View: Impressions, clicks, revenue
- Payment: Sent monthly (minimum $100)

### RevenueCat Dashboard
- Check: https://app.revenuecat.com/
- View: Active subscriptions, MRR, churn
- Payment: Through Google Play (70% to you, 30% to Google)

### Google Play Console
- Check: Downloads, ratings, crashes
- View: Subscription metrics
- Payment: Monthly (around 15th of each month)

---

## 🆘 Troubleshooting

**"No ads showing after launch"**
- Wait 1-2 hours for Google to approve your app for ads
- Check AdMob account is approved
- Verify ad unit IDs are correct

**"Subscription button doesn't work"**
- Subscriptions only work after Play Store approval
- Check RevenueCat is configured correctly
- Verify product ID matches in Play Console and RevenueCat

**"App crashes on launch"**
- Check all API keys are valid
- Ensure you rebuilt app after changing keys
- Check crash reports in Play Console

---

## 💰 Payment Setup

### AdMob Payments
1. Go to AdMob → Payments
2. Add payment method (bank account or wire transfer)
3. Verify your address and tax info
4. Minimum payout: $100
5. Payment schedule: Monthly (around 21st)

### Google Play Payments (Subscriptions)
1. Go to Play Console → Payments
2. Set up merchant account
3. Add bank details
4. Payments: Monthly (around 15th)
5. Google takes 30% (you get 70%)

---

## 🎯 Next Steps After Launch

**Week 1:**
- Monitor for crashes
- Respond to reviews
- Track initial revenue

**Month 1:**
- Analyze which features users love
- Check subscription conversion rate
- Optimize ad placements if needed

**Month 2+:**
- Add more features based on feedback
- Consider adding more ad networks (mediation)
- Experiment with different subscription prices
- Add annual subscription option ($19.99/year = better value)

---

Good luck with your launch! 🚀
