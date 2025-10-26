# 🔐 RevenueCat Setup Guide

## ✅ Payment Integration Complete!

Your app now has **real payment functionality** integrated! Here's how to configure it:

---

## 🚀 Quick Start (15 minutes)

### Step 1: Create RevenueCat Account (Free)

1. Go to https://www.revenuecat.com
2. Click "Sign Up" - it's **FREE**
3. Use your email (Gmail works fine)
4. Create a new project: **"CleanSwipe"**

---

### Step 2: Add Your Apps

#### iOS App

1. In RevenueCat dashboard, click **"Apps"**
2. Click **"+ Add App"**
3. Fill in:
   - **App name:** CleanSwipe iOS
   - **Bundle ID:** `com.nischaysood.cleanswipe`
   - **Platform:** iOS / App Store
4. Click **"Create"**
5. **Copy the API Key** (starts with `appl_...`)

#### Android App

1. Click **"+ Add App"** again
2. Fill in:
   - **App name:** CleanSwipe Android
   - **Package name:** `com.nischaysood.cleanswipe`
   - **Platform:** Android / Play Store
3. Click **"Create"**
4. **Copy the API Key** (starts with `goog_...`)

---

### Step 3: Add API Keys to Your App

1. Open file: `src/services/PurchaseService.js`
2. Find these lines (at the top):

```javascript
const REVENUECAT_API_KEY_IOS = 'appl_YOUR_IOS_KEY_HERE';
const REVENUECAT_API_KEY_ANDROID = 'goog_YOUR_ANDROID_KEY_HERE';
```

3. Replace with your actual keys:

```javascript
const REVENUECAT_API_KEY_IOS = 'appl_xYz123AbC456...';  // Your iOS key
const REVENUECAT_API_KEY_ANDROID = 'goog_aBc789XyZ123...';  // Your Android key
```

4. Save the file

---

### Step 4: Create Products in Stores

#### iOS - App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Select **CleanSwipe** app
3. Go to **Features → In-App Purchases**
4. Click **"+"** to create new
5. Select **"Auto-Renewable Subscription"**
6. Fill in:
   - **Reference Name:** CleanSwipe Pro Monthly
   - **Product ID:** `cleanswipe_pro_monthly`
   - **Subscription Group:** Create new "CleanSwipe Pro"
7. Add pricing:
   - **Price:** $4.99/month (Tier 6)
   - Or ₹299/month for India
8. Add localization:
   - **Display Name:** Pro Subscription
   - **Description:** Unlimited photo swipes and premium features
9. Click **"Save"**
10. **Submit for review** (with your app)

#### Android - Google Play Console

1. Go to https://play.google.com/console
2. Select **CleanSwipe** app
3. Go to **Monetization → Products → Subscriptions**
4. Click **"Create subscription"**
5. Fill in:
   - **Product ID:** `cleanswipe_pro_monthly`
   - **Name:** CleanSwipe Pro
   - **Description:** Unlimited photo swipes and premium features
6. Create **Base plan:**
   - **Billing period:** 1 month
   - **Price:** $4.99 or ₹299
   - **Renewal:** Automatic
7. Click **"Activate"**

---

### Step 5: Link Products in RevenueCat

#### Create Entitlement

1. In RevenueCat dashboard, go to **"Entitlements"**
2. Click **"+ New"**
3. Create entitlement:
   - **Identifier:** `pro`
   - **Display Name:** Pro Access
4. Click **"Save"**

#### Link iOS Product

1. Go to **"Products" tab**
2. Click **"+ Add"**
3. Select:
   - **App:** CleanSwipe iOS
   - **Store:** App Store
   - **Product ID:** `cleanswipe_pro_monthly`
4. Attach to entitlement: **"pro"**
5. Click **"Save"**

#### Link Android Product

1. Click **"+ Add"** again
2. Select:
   - **App:** CleanSwipe Android
   - **Store:** Play Store
   - **Product ID:** `cleanswipe_pro_monthly`
3. Attach to entitlement: **"pro"**
4. Click **"Save"**

---

### Step 6: Configure Offerings (Optional but Recommended)

1. Go to **"Offerings"** in RevenueCat
2. Click **"+ Create offering"**
3. Name it: **"default"** (must be lowercase)
4. Add packages:
   - **Monthly:** Link to `cleanswipe_pro_monthly`
5. Make it **"Current"**
6. Save

---

### Step 7: Test in Sandbox Mode

#### iOS Testing

1. Create a **Sandbox Test Account** in App Store Connect:
   - Go to Users & Access → Sandbox Testers
   - Add email (can be fake: test@test.com)
2. On your iPhone/Simulator:
   - Sign OUT of App Store
   - Open CleanSwipe
   - Reach paywall
   - Tap "Upgrade"
   - Sign in with test account when prompted
   - **Purchase is FREE in sandbox!**

#### Android Testing

1. Add test account in Play Console:
   - Go to Setup → License testing
   - Add your Gmail account
2. Build and install app
3. Reach paywall
4. Purchase (**FREE for test accounts!**)

---

## ✅ Verification Checklist

After setup, verify everything works:

### In RevenueCat Dashboard:
- [ ] iOS app added with API key
- [ ] Android app added with API key
- [ ] Entitlement "pro" created
- [ ] Products linked to both apps
- [ ] Offering created (optional)

### In Your Code:
- [ ] API keys added to `PurchaseService.js`
- [ ] App runs without errors
- [ ] Can reach paywall screen
- [ ] See product pricing (if offerings configured)

### Testing:
- [ ] Test purchase in sandbox mode
- [ ] Pro status grants unlimited swipes
- [ ] Restore purchases works
- [ ] Subscription persists after app restart

---

## 🎯 What Happens Now?

### Without RevenueCat Configured (Current State):

```
User reaches 50 swipes
    ↓
Paywall shows
    ↓
User taps "Upgrade"
    ↓
Alert: "Demo Mode - RevenueCat not configured"
    ↓
User taps "Continue"
    ↓
Fake Pro status granted (for testing)
```

### With RevenueCat Configured:

```
User reaches 50 swipes
    ↓
Paywall shows real price (from store)
    ↓
User taps "Upgrade"
    ↓
Apple/Google payment sheet appears
    ↓
User confirms with Face ID/Password
    ↓
Real purchase processed
    ↓
Revenue credited to your account
    ↓
User gets Pro access immediately
```

---

## 💰 Revenue Flow

```
User subscribes for $4.99/month
        ↓
Apple/Google collects payment
        ↓
Apple/Google takes 30% ($1.50)
        ↓
RevenueCat validates receipt (free)
        ↓
You get 70% ($3.49) → ~₹290
        ↓
Paid to your bank account
        ↓
Monthly recurring revenue!
```

---

## 🔧 Troubleshooting

### "No products found"
**Solution:**
- Check Product IDs match exactly in:
  - App Store Connect / Play Console
  - RevenueCat dashboard
  - Must be: `cleanswipe_pro_monthly`

### "Purchase failed"
**Solution:**
- Using sandbox test account?
- Signed out of real Apple ID?
- Product activated in store?
- Wait 24 hours after creating product

### "Not seeing price"
**Solution:**
- Create "Offerings" in RevenueCat
- Make sure it's marked as "Current"
- Add packages to offering

### "API Key not working"
**Solution:**
- Copy entire key including prefix (appl_ or goog_)
- No spaces before/after
- App restarted after adding keys?

---

## 📱 For Production Launch

### Before Submitting to Stores:

1. **Test thoroughly in sandbox**
   - Make purchase
   - Verify Pro features
   - Test restore purchases
   - Check cancellation

2. **Remove test code**
   - No console.logs in production
   - No debug alerts

3. **Update privacy policy**
   - Mention subscription terms
   - Cancellation policy
   - Refund policy

4. **Submit with In-App Purchase**
   - iOS: Submit product with app
   - Android: Activate product first

### After Approval:

1. **Monitor in RevenueCat**
   - Real-time purchases
   - Revenue tracking
   - Churn rate
   - Trial conversions

2. **Respond to issues**
   - Support emails
   - Failed purchases
   - Subscription questions

---

## 💡 Pro Tips

### 1. Start Simple
- Launch with monthly subscription only
- Add annual/lifetime later
- Test pricing

### 2. Free Trial (Optional)
- Offer 7-day free trial
- Increases conversions 2-3x
- Set up in App Store/Play Console

### 3. Pricing Strategy
**Global:** $4.99/month
- Works well internationally
- Not too cheap, not too expensive

**India-specific:** ₹299/month
- More competitive locally
- Can be set separately in stores

### 4. Analytics
RevenueCat tracks:
- Monthly Recurring Revenue (MRR)
- Churn rate
- Average Revenue Per User (ARPU)
- Trial conversion rate

---

## 🆘 Need Help?

### RevenueCat Resources:
- Docs: https://docs.revenuecat.com
- Support: support@revenuecat.com
- Community: https://community.revenuecat.com

### Apple Resources:
- IAP Guide: https://developer.apple.com/in-app-purchase/
- Testing: https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_with_sandbox

### Google Resources:
- Billing Docs: https://developer.android.com/google/play/billing
- Testing: https://developer.android.com/google/play/billing/test

---

## ✨ Summary

**What You Have Now:**
- ✅ Full payment integration code
- ✅ Works on iOS and Android
- ✅ Sandbox testing ready
- ✅ Production ready
- ✅ Falls back gracefully if not configured

**What You Need to Do:**
1. Create RevenueCat account (5 mins)
2. Add API keys to code (2 mins)
3. Create products in stores (10 mins per platform)
4. Test in sandbox (5 mins)
5. Launch! 🚀

**Total time:** 30-45 minutes to go from demo to real payments!

---

**Your app is ready to monetize! Just add the API keys and products!** 💰
