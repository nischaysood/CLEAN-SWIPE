# 💳 Payment Integration Guide for CleanSwipe

## Overview

This guide will help you implement real payments using **RevenueCat** + **Apple In-App Purchases**.

---

## 🎯 Option 1: RevenueCat (Recommended)

### Why RevenueCat?
- ✅ Easiest implementation (3-4 hours)
- ✅ Handles subscriptions automatically
- ✅ Server-side validation (prevents fraud)
- ✅ Works on both iOS and Android
- ✅ Built-in analytics
- ✅ Free tier: $2,500/month revenue

---

## 📋 Prerequisites

### 1. Apple Developer Account ($99/year)
- Sign up: https://developer.apple.com
- Needed to create In-App Purchases
- Required for App Store submission

### 2. RevenueCat Account (Free)
- Sign up: https://www.revenuecat.com
- Create a new project
- Get your API key

---

## 🛠️ Implementation Steps

### Step 1: Install RevenueCat SDK

```bash
cd /Users/nischaysood/Desktop/clean-swipe
npm install react-native-purchases
npx pod-install  # For iOS
```

### Step 2: Create In-App Purchases in App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Select your app
3. Go to "In-App Purchases"
4. Click "+" to create new subscription

**Subscription Details:**
```
Product ID: cleanswipe_pro_monthly
Type: Auto-Renewable Subscription
Price: $4.99/month
Display Name: CleanSwipe Pro
Description: Unlimited photo swipes and advanced features
```

**Subscription Groups:**
- Group Name: "CleanSwipe Pro"
- Add monthly and annual options

### Step 3: Configure RevenueCat

1. **Add App in RevenueCat Dashboard:**
   - Go to RevenueCat dashboard
   - Add new app
   - Select iOS platform
   - Enter Bundle ID: `com.nischaysood.cleanswipe`

2. **Add Products:**
   - Navigate to Products
   - Add "cleanswipe_pro_monthly"
   - Link to Apple In-App Purchase

3. **Copy API Key:**
   - Go to API Keys
   - Copy your public SDK key
   - Example: `appl_XxXxXxXxXxXxXx`

### Step 4: Update Code

Create `src/services/PurchaseService.js`:

```javascript
import Purchases from 'react-native-purchases';

const REVENUECAT_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your key

class PurchaseService {
  async initialize() {
    try {
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
      console.log('RevenueCat initialized');
    } catch (error) {
      console.error('Error initializing purchases:', error);
    }
  }

  async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        return offerings.current.availablePackages;
      }
      return [];
    } catch (error) {
      console.error('Error getting offerings:', error);
      return [];
    }
  }

  async purchasePackage(packageToPurchase) {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
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

  async checkProStatus(customerInfo = null) {
    try {
      if (!customerInfo) {
        customerInfo = await Purchases.getCustomerInfo();
      }
      
      // Check if user has active subscription
      const isPro = customerInfo.entitlements.active['pro'] !== undefined;
      return isPro;
    } catch (error) {
      console.error('Error checking pro status:', error);
      return false;
    }
  }

  async restorePurchases() {
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      return this.checkProStatus(customerInfo);
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }
}

export default new PurchaseService();
```

### Step 5: Update App.js

```javascript
import PurchaseService from './src/services/PurchaseService';

export default function App() {
  useEffect(() => {
    // Initialize RevenueCat on app start
    PurchaseService.initialize();
  }, []);

  // ... rest of your code
}
```

### Step 6: Update PaywallScreen.js

```javascript
import PurchaseService from '../services/PurchaseService';

export default function PaywallScreen({ swipesUsed, onUpgrade }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const availablePackages = await PurchaseService.getOfferings();
    setPackages(availablePackages);
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (packages.length === 0) return;

    try {
      const isPro = await PurchaseService.purchasePackage(packages[0]);
      if (isPro) {
        onUpgrade(); // Call your existing upgrade handler
      }
    } catch (error) {
      Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
    }
  };

  // ... rest of your component
  // Replace the dummy upgrade button with handlePurchase
}
```

### Step 7: Update GalleryScreen.js

```javascript
import PurchaseService from '../services/PurchaseService';

// In initializeApp function
const checkProStatus = async () => {
  const isPro = await PurchaseService.checkProStatus();
  setIsPro(isPro);
  
  // Also save to AsyncStorage for offline checks
  if (isPro) {
    await AsyncStorage.setItem(IS_PRO_KEY, 'true');
  }
};
```

---

## 🧪 Testing

### Test Mode (Sandbox)
1. Create test user in App Store Connect
2. Sign out of App Store on device
3. Use test account when prompted
4. Purchases are free in sandbox mode

### Test Flow:
```
1. Reach 50 swipe limit
2. Paywall appears
3. Tap "Upgrade to Pro"
4. Apple payment sheet appears
5. Confirm with Face ID/Password (free in test mode)
6. Pro status granted
7. Unlimited swipes enabled
```

---

## 💰 Pricing Strategy

### Recommended Options:

**Option A: Single Subscription**
- $4.99/month - Unlimited swipes
- Simple, easy to understand

**Option B: Multiple Tiers**
- $2.99/month - Monthly Pro
- $24.99/year - Annual Pro (save 58%)
- Better revenue (annual converts better)

**Option C: Lifetime**
- $19.99 - One-time purchase
- Unlimited swipes forever
- Good for users who hate subscriptions

### Implementing Multiple Options:

In App Store Connect, create:
```
1. cleanswipe_pro_monthly - $4.99/month
2. cleanswipe_pro_annual - $24.99/year
3. cleanswipe_lifetime - $19.99 (non-consumable)
```

Update PaywallScreen to show all options.

---

## 🔐 Security Best Practices

### 1. Server-Side Validation
- RevenueCat handles this automatically
- Prevents jailbreak/root bypass
- Validates receipts with Apple/Google

### 2. Offline Access
- Cache pro status in AsyncStorage
- Check server on app launch
- Graceful degradation if offline

### 3. Receipt Verification
```javascript
// RevenueCat does this automatically
// But you can add extra checks:
const verifyPurchase = async () => {
  const customerInfo = await Purchases.getCustomerInfo();
  const isPro = customerInfo.entitlements.active['pro'] !== undefined;
  
  // Sync with your backend (optional)
  await syncProStatusWithServer(isPro);
};
```

---

## 📊 Analytics & Monitoring

RevenueCat Dashboard shows:
- Revenue (MRR, annual)
- Active subscriptions
- Churn rate
- Trial conversions
- Refund rate

---

## 🎯 Alternative Options

### Option 2: Stripe (More Complex)

**Pros:**
- Lower fees (2.9% + 30¢)
- More control
- Custom checkout

**Cons:**
- Requires backend server
- More implementation time
- No App Store integration

### Option 3: Native In-App Purchases (Hardest)

**Pros:**
- No third-party service
- Full control

**Cons:**
- Complex implementation (weeks)
- Manual receipt validation
- No cross-platform support
- You handle all edge cases

---

## 💡 Recommended Approach

**For CleanSwipe:**

1. **Start with RevenueCat** (easiest, fastest)
2. **Use Apple In-App Purchases** (required for App Store)
3. **Offer monthly subscription** ($4.99/month)
4. **Add annual option later** (better revenue)
5. **Monitor analytics** (optimize pricing)

**Timeline:**
- Setup: 2-3 hours
- Testing: 1-2 hours
- Submit to App Store: 1-2 days approval
- Total: Can be done in one day!

---

## 📱 User Flow

### Before Payment Integration:
```
50 swipes → Paywall → "Continue" → Fake Pro status
```

### After Payment Integration:
```
50 swipes → Paywall → "Upgrade" → Apple Payment → Real Pro status
```

### For Existing Users:
```
Open app → Check subscription → Grant Pro if active
```

---

## 🚀 Launch Checklist

### Pre-Launch:
- [ ] Apple Developer Account active
- [ ] RevenueCat configured
- [ ] In-App Purchases created
- [ ] Test purchases in sandbox
- [ ] Restore purchases works
- [ ] Privacy policy updated (required!)
- [ ] Terms of service added

### Launch:
- [ ] Submit app for review
- [ ] App Store approval (1-2 days)
- [ ] Monitor purchases in RevenueCat
- [ ] Check for errors
- [ ] Respond to user issues

---

## 💵 Revenue Estimates

**Conservative (100 users/month):**
- 5% conversion rate = 5 paying users
- $4.99/month × 5 = $24.95/month
- Annual: ~$300

**Moderate (1,000 users/month):**
- 5% conversion = 50 paying users
- $4.99 × 50 = $249.50/month
- Annual: ~$3,000

**Optimistic (10,000 users/month):**
- 5% conversion = 500 paying users
- $4.99 × 500 = $2,495/month
- Annual: ~$30,000

**Apple takes 30% (15% after year 1)**

---

## 🆘 Support & Resources

### Documentation:
- RevenueCat Docs: https://docs.revenuecat.com
- Apple IAP Guide: https://developer.apple.com/in-app-purchase/
- React Native Purchases: https://github.com/RevenueCat/react-native-purchases

### Common Issues:
1. "No products found" → Check App Store Connect setup
2. "Purchase failed" → Test account signed in?
3. "Receipt invalid" → RevenueCat not configured?

---

## 🎓 Next Steps

1. **Get Apple Developer Account** (if you don't have)
2. **Sign up for RevenueCat** (free)
3. **Create In-App Purchase** in App Store Connect
4. **Install & configure RevenueCat SDK**
5. **Test in sandbox mode**
6. **Submit to App Store**
7. **Launch! 🚀**

---

**Total time to implement: 4-6 hours**
**Cost: $99/year (Apple) + Free (RevenueCat < $2,500/mo)**

Good luck! 💪
