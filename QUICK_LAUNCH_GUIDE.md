# ⚡ Quick Launch Guide - Do This Tomorrow!

## 🎯 3-Step Launch Process

### STEP 1: Get Your API Keys (30 minutes)

**AdMob (https://admob.google.com/):**
1. Create account → Add app → Create 2 ad units (Banner + Rewarded)
2. Copy these 3 IDs:
   - App ID: `ca-app-pub-XXXXX~XXXXX`
   - Banner Unit: `ca-app-pub-XXXXX/XXXXX`
   - Rewarded Unit: `ca-app-pub-XXXXX/XXXXX`

**RevenueCat (https://revenuecat.com/):**
1. Create account → New project → Link Google Play
2. Create product `pro_monthly` → Create entitlement `pro`
3. Copy Android API key: `goog_XXXXX`

**Google Play Console:**
1. Go to Monetize → Subscriptions → Create subscription
2. Product ID: `pro_monthly`
3. Price: $2.99/month

---

### STEP 2: Update Your App (5 minutes)

**Option A: Use the script (easiest)**
```bash
./setup-production-keys.sh
```
Then paste your keys when prompted.

**Option B: Manual update**
Update these 3 files:
- `app.json` - AdMob App ID
- `src/services/AdService.js` - Banner & Rewarded Unit IDs
- `src/services/PurchaseService.js` - RevenueCat key

---

### STEP 3: Build & Upload (20 minutes)

```bash
# Build production version
eas build --platform android --profile production

# Wait for build to complete (10-15 min)
# Download the .aab file
# Upload to Play Console → Production → Create new release
```

---

## 💰 What Happens After Launch?

### First 2 Hours
- ✅ App goes live on Play Store
- ⏳ Ads show as "test ads" (normal!)
- ⏳ Real ads start appearing

### First 24 Hours
- ✅ Real ads fully active
- ✅ Subscriptions working
- 📊 Check AdMob dashboard for first revenue

### First Week
- 💵 Monitor daily revenue
- ⭐ Respond to reviews
- 🐛 Fix any bugs

---

## 📊 Expected Revenue (Realistic)

**If you get 1,000 downloads in first month:**

**Free users (90% = 900 users):**
- Banner ads: $0.50/day = $15/month
- Rewarded videos: $2/day = $60/month
- **Total from ads: ~$75/month**

**Pro subscribers (10% = 100 users):**
- 100 × $2.99 = $299/month
- Google takes 30% = -$90
- **You get: ~$209/month**

**Total first month: ~$284** 🎉

**If you get 10,000 downloads:**
- Ads: ~$750/month
- Subscriptions: ~$2,090/month
- **Total: ~$2,840/month** 🚀

---

## 🚨 Common Issues & Fixes

**"No ads showing"**
→ Wait 1-2 hours after launch. Check AdMob account is approved.

**"Subscription doesn't work"**
→ Only works after Play Store approval. Check product ID matches everywhere.

**"App crashes"**
→ Make sure you rebuilt app after adding API keys.

---

## ✅ Pre-Launch Checklist

Before you click "Submit for Review":

- [ ] All API keys updated
- [ ] App builds successfully
- [ ] Tested on real device
- [ ] Screenshots added to Play Console
- [ ] App description written
- [ ] Privacy policy added
- [ ] Content rating completed
- [ ] Subscription product created ($2.99/month)

---

## 🎯 Files You Need to Update

Only these 3 files need changes:

1. **app.json** (line 35)
   ```json
   "androidAppId": "YOUR_ADMOB_APP_ID"
   ```

2. **src/services/AdService.js** (lines 9-14)
   ```javascript
   rewarded: {
     android: __DEV__ ? TestIds.REWARDED : 'YOUR_REWARDED_UNIT_ID',
   },
   banner: {
     android: __DEV__ ? TestIds.BANNER : 'YOUR_BANNER_UNIT_ID',
   },
   ```

3. **src/services/PurchaseService.js** (line 5)
   ```javascript
   const REVENUECAT_API_KEY_ANDROID = 'YOUR_REVENUECAT_KEY';
   ```

---

## 📱 Testing Before Launch

```bash
# Build and test on your phone
eas build --platform android --profile preview
# Install on your device and test:
# ✓ Ads show (will be test ads)
# ✓ Subscription flow works
# ✓ App doesn't crash
```

---

## 🆘 Need Help?

**AdMob Issues:**
- Help: https://support.google.com/admob/

**RevenueCat Issues:**
- Docs: https://docs.revenuecat.com/
- Support: support@revenuecat.com

**Play Console Issues:**
- Help: https://support.google.com/googleplay/android-developer/

---

## 🎉 You're Ready!

Your app is already 95% ready for launch. Just need to:
1. Get API keys (30 min)
2. Update 3 files (5 min)
3. Build & upload (20 min)

**Total time: ~1 hour** ⚡

Good luck with your launch tomorrow! 🚀
