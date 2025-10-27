# 🚀 CleanSwipe Launch Plan

## 💰 Pricing Strategy

**India:** ₹99/month
**International:** $1.99/month

---

## ✅ Complete Checklist

### Step 1: Developer Accounts (Week 1)

#### Apple Developer Account
- [ ] Go to https://developer.apple.com/programs/enroll/
- [ ] Sign up with Apple ID
- [ ] Pay $99 (₹8,250)
- [ ] Wait for approval (usually instant)
- [ ] Cost: $99/year

#### Google Play Console
- [ ] Go to https://play.google.com/console/signup
- [ ] Sign up with Google account
- [ ] Pay $25 (₹2,085)
- [ ] One-time payment forever!
- [ ] Cost: $25 one-time

**Total Investment: $124 (₹10,335)**

---

### Step 2: Create In-App Purchases (Week 1-2)

#### iOS - App Store Connect

1. **Create App:**
   - [ ] Go to https://appstoreconnect.apple.com
   - [ ] Click "+" to add new app
   - [ ] Name: CleanSwipe
   - [ ] Bundle ID: com.nischaysood.cleanswipe
   - [ ] SKU: cleanswipe-001
   - [ ] Primary Language: English (US)

2. **Create Subscription:**
   - [ ] Go to Features → In-App Purchases
   - [ ] Click "+"
   - [ ] Select "Auto-Renewable Subscription"
   
   **Details:**
   ```
   Reference Name: CleanSwipe Pro Monthly
   Product ID: cleanswipe_pro_monthly
   ```

3. **Create Subscription Group:**
   - [ ] Name: CleanSwipe Pro
   - [ ] Click "Create"

4. **Set Pricing:**
   - [ ] Base price: $1.99/month
   - [ ] Select price tier
   - [ ] Go to "Price Per Territory"
   - [ ] Find "India (IN)"
   - [ ] Set custom price: ₹99
   - [ ] Save

5. **Add Localization:**
   ```
   Display Name: Pro Subscription
   Description: Get unlimited photo swipes and premium features. Cancel anytime.
   ```

6. **Review Information:**
   - [ ] Add screenshot (can be any photo screen)
   - [ ] Add review notes
   - [ ] Save

7. **Submit for Review:**
   - [ ] Submit with your app
   - [ ] Wait for approval

#### Android - Google Play Console

1. **Create App:**
   - [ ] Go to https://play.google.com/console
   - [ ] Click "Create app"
   - [ ] App name: CleanSwipe
   - [ ] Default language: English (US)
   - [ ] App/Game: App
   - [ ] Free/Paid: Free
   - [ ] Accept policies

2. **Create Subscription:**
   - [ ] Go to Monetization → Products → Subscriptions
   - [ ] Click "Create subscription"
   
   **Details:**
   ```
   Product ID: cleanswipe_pro_monthly
   Name: CleanSwipe Pro
   Description: Unlimited photo swipes and premium features
   ```

3. **Create Base Plan:**
   - [ ] Click "Add base plan"
   - [ ] Billing period: 1 month (P1M)
   - [ ] Renewal type: Auto-renewing
   - [ ] Name: Monthly

4. **Set Pricing:**
   - [ ] Default price: $1.99
   - [ ] Go to "Add country prices"
   - [ ] Find India
   - [ ] Set: ₹99
   - [ ] Save

5. **Configure Settings:**
   - [ ] Grace period: 3 days (optional)
   - [ ] Benefits: Unlimited swipes, Premium features
   - [ ] Save

6. **Activate:**
   - [ ] Review all details
   - [ ] Click "Activate"

---

### Step 3: RevenueCat Setup (30 minutes)

#### Create Account
- [ ] Go to https://www.revenuecat.com
- [ ] Sign up (FREE)
- [ ] Create project: CleanSwipe
- [ ] Skip payment method

#### Add iOS App
- [ ] Click "Apps" → "Add App"
- [ ] Platform: iOS (App Store)
- [ ] App name: CleanSwipe iOS
- [ ] Bundle ID: com.nischaysood.cleanswipe
- [ ] Save
- [ ] Copy iOS API key: `appl_xxxxxxxxxx`

#### Add Android App
- [ ] Click "Add App" again
- [ ] Platform: Android (Google Play)
- [ ] App name: CleanSwipe Android
- [ ] Package: com.nischaysood.cleanswipe
- [ ] Save
- [ ] Copy Android API key: `goog_xxxxxxxxxx`

#### Create Entitlement
- [ ] Go to "Entitlements"
- [ ] Click "New"
- [ ] Identifier: `pro`
- [ ] Display name: Pro Access
- [ ] Save

#### Link Products
- [ ] Go to "Products"
- [ ] Click "Add"
- [ ] App: CleanSwipe iOS
- [ ] Product ID: cleanswipe_pro_monthly
- [ ] Attach to: pro
- [ ] Save
- [ ] Repeat for Android app

#### Create Offering (Optional)
- [ ] Go to "Offerings"
- [ ] Click "Create offering"
- [ ] Identifier: default
- [ ] Add package: Monthly → cleanswipe_pro_monthly
- [ ] Make current
- [ ] Save

---

### Step 4: Update Code with API Keys

**File:** `src/services/PurchaseService.js`

Replace lines 4-5 with your actual keys:

```javascript
const REVENUECAT_API_KEY_IOS = 'appl_YOUR_ACTUAL_KEY';
const REVENUECAT_API_KEY_ANDROID = 'goog_YOUR_ACTUAL_KEY';
```

---

### Step 5: Build Production Apps (1 hour)

#### iOS Build
```bash
eas build --platform ios --profile production
```
- [ ] Wait 15-20 minutes
- [ ] Download IPA file
- [ ] Upload to App Store Connect via Transporter app

#### Android Build
```bash
eas build --platform android --profile production
```
- [ ] Wait 15-20 minutes
- [ ] Download AAB file
- [ ] Upload to Google Play Console

---

### Step 6: App Store Listings (2-3 hours)

#### Create Assets

**App Icon (Required):**
- [ ] iOS: 1024x1024 PNG (no transparency)
- [ ] Android: 512x512 PNG

**Screenshots (Required):**
- [ ] iOS: 3-5 screenshots
  - 6.7" display (1290x2796)
  - 5.5" display (1242x2208)
- [ ] Android: 2-8 screenshots
  - Phone (1080x1920)

**Feature Graphic (Android only):**
- [ ] 1024x500 PNG

**Screenshots to take:**
1. Month selector screen
2. Swipe screen with photo
3. Deleted counter
4. Paywall screen
5. Pro badge

#### iOS App Store

**App Information:**
- [ ] Name: CleanSwipe
- [ ] Subtitle: Tinder for Your Photos
- [ ] Category: Photo & Video
- [ ] Age Rating: 4+

**Description:**
```
Declutter your photo gallery in minutes! 

CleanSwipe makes cleaning your photo library fun and easy with a simple swipe interface - just like Tinder, but for photos!

✨ FEATURES:
• Swipe left to delete, right to keep
• Browse photos by month
• Undo accidentally deleted photos
• Safe deletion (30-day recovery window)
• Beautiful dark theme
• Smooth, fluid animations
• Works completely offline

🗑️ SAFE DELETION:
Your photos go to "Recently Deleted" where they can be recovered for 30 days.

💎 PRICING:
• Free: 50 swipes to get started
• Pro: ₹99/month for unlimited swipes ($1.99/month internationally)

📸 Clean up your gallery today!
```

**Keywords:**
```
photo,gallery,cleaner,organize,delete,storage,tinder,swipe,cleanup,manager
```

- [ ] Privacy Policy URL (required)
- [ ] Support URL
- [ ] Upload screenshots
- [ ] Upload app icon
- [ ] Submit for review

#### Android Play Store

**Store Listing:**
- [ ] App name: CleanSwipe
- [ ] Short description: "Tinder for photos - swipe to declutter your gallery!"
- [ ] Full description: (same as iOS)
- [ ] App category: Photography
- [ ] Upload icon
- [ ] Upload screenshots
- [ ] Upload feature graphic

**Content Rating:**
- [ ] Complete questionnaire
- [ ] Rating: Everyone

**Pricing:**
- [ ] Free
- [ ] Contains In-App Purchases

**Store Presence:**
- [ ] Countries: All (or select specific)
- [ ] Primary language: English

---

### Step 7: Privacy Policy (Required - 30 mins)

Use free generator:
- [ ] Go to https://app-privacy-policy-generator.firebaseapp.com
- [ ] Fill in details
- [ ] Generate policy
- [ ] Host on GitHub Pages or website
- [ ] Add URL to both stores

**What to include:**
- Photo library access
- What data is collected (subscriptions)
- How data is used
- No data sharing
- User rights

---

### Step 8: Submit for Review

#### iOS
- [ ] Select build in App Store Connect
- [ ] Fill all required info
- [ ] Submit for review
- [ ] Wait 1-2 days
- [ ] Respond to any feedback

#### Android
- [ ] Create production release
- [ ] Upload AAB
- [ ] Add release notes
- [ ] Submit for review
- [ ] Usually approved in hours!

---

### Step 9: Launch! 🚀

Once approved:
- [ ] Apps go live
- [ ] Share with friends/family
- [ ] Post on social media
- [ ] Monitor reviews
- [ ] Track revenue in RevenueCat

---

## 💰 Revenue Projections

### Conservative (First 3 Months)

**India:**
- 100 downloads
- 5% conversion = 5 users
- ₹99 × 5 = ₹495/month
- After stores: ₹346/month

**International:**
- 50 downloads
- 10% conversion = 5 users
- $1.99 × 5 = $9.95/month (₹830)
- After stores: ₹581/month

**Total: ₹927/month = ₹11,000/year**

### Moderate (After 6 Months)

**India:**
- 1,000 users
- 5% = 50 paid
- ₹99 × 50 = ₹4,950/month
- After stores: ₹3,465/month

**International:**
- 500 users
- 10% = 50 paid
- $1.99 × 50 = ₹8,300/month
- After stores: ₹5,810/month

**Total: ₹9,275/month = ₹1.1 lakhs/year**

### Success (After 1 Year)

**Total: ₹50,000-100,000/month possible**

---

## 📊 Timeline

**Week 1:** Get developer accounts
**Week 2:** Create In-App Purchases, set up RevenueCat
**Week 3:** Build apps, create assets
**Week 4:** Submit for review
**Week 5:** LAUNCH! 🎉

**Total time: 4-5 weeks**

---

## 💡 Tips for Success

### Pricing Strategy
- ✅ Very competitive pricing (₹99 vs industry ₹300-500)
- ✅ Good for Indian market
- ✅ International price also attractive

### Marketing
- Share on Product Hunt
- Post on Reddit (r/androidapps, r/iosapps)
- Instagram reels showing before/after
- WhatsApp status
- College groups

### User Retention
- Respond to reviews quickly
- Fix bugs fast
- Add requested features
- Send update notifications

---

## 🆘 Support

**If you get stuck:**
- Apple: developer@apple.com
- Google: play.google.com/console/support
- RevenueCat: support@revenuecat.com

**Need help with code:**
- I'm here! Just ask!

---

**Ready to launch! Follow this checklist step by step.** 🚀

**Current status: You need developer accounts first!**
