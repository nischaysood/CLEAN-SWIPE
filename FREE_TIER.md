# 🎯 Free Tier & Monetization

CleanSwipe implements a freemium model with **50 free swipes** for new users.

## How It Works

### Free Users
- **50 free swipes** to try the app
- After 50 swipes, see paywall screen
- Counter shows remaining swipes in the top panel

### Pro Users
- **Unlimited swipes**
- Pro badge displayed (✨ Pro)
- One-time upgrade or subscription (configurable)

## Implementation Details

### Swipe Tracking
```javascript
- Stored in AsyncStorage: '@CleanSwipe:swipeCount'
- Increments on every delete or skip action
- Persists across app sessions
```

### Pro Status
```javascript
- Stored in AsyncStorage: '@CleanSwipe:isPro'
- Set to 'true' after upgrade
- Checked before allowing swipes
```

### Current Limits
- **FREE_SWIPES_LIMIT**: 50 (configurable in GalleryScreen.js)

## Testing the Feature

### Reset Free Swipes (for testing)
To reset the swipe counter during development:

1. Open React Native Debugger or Metro console
2. Run this in console:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.multiRemove(['@CleanSwipe:swipeCount', '@CleanSwipe:isPro']);
```

Or use this helper function (add to GalleryScreen for testing):
```javascript
const resetForTesting = async () => {
  await AsyncStorage.multiRemove([SWIPE_COUNT_KEY, IS_PRO_KEY]);
  setSwipeCount(0);
  setIsPro(false);
  setShowPaywall(false);
};
```

### Simulate Pro User
```javascript
const simulatePro = async () => {
  await AsyncStorage.setItem(IS_PRO_KEY, 'true');
  setIsPro(true);
  setShowPaywall(false);
};
```

## Payment Integration (TODO)

The current implementation shows a placeholder paywall. To implement real payments:

### Option 1: RevenueCat (Recommended)
```bash
npm install react-native-purchases
```

Benefits:
- Multi-platform (iOS + Android)
- Handles subscriptions
- Analytics built-in
- Server-side receipt validation

### Option 2: Stripe
```bash
npm install @stripe/stripe-react-native
```

Benefits:
- Direct payment control
- Lower fees
- Custom pricing models

### Option 3: Native In-App Purchases
- iOS: StoreKit
- Android: Google Play Billing

## Pricing Suggestions

### One-Time Purchase
- **$4.99** - Lifetime unlimited swipes

### Subscription Options
- **$2.99/month** - Monthly unlimited
- **$19.99/year** - Annual unlimited (save 44%)

### Freemium Tiers
- **Free**: 50 swipes
- **Basic**: $1.99 - 500 swipes/month
- **Pro**: $4.99 - Unlimited swipes

## User Flow

1. **New User**
   - Opens app
   - Sees "50 left" in top panel
   - Starts swiping

2. **Approaching Limit**
   - Counter shows "5 left", "4 left", etc.
   - Visual feedback of remaining swipes

3. **Limit Reached**
   - Paywall screen appears
   - Shows upgrade options
   - Can tap "Upgrade to Pro"

4. **After Upgrade**
   - Shows "✨ Pro" badge
   - Unlimited swipes enabled
   - Counter removed

## Analytics to Track

Recommended metrics:
- Free swipes used (average per user)
- Conversion rate (free → pro)
- Time to conversion
- Churn rate
- Revenue per user

## Future Enhancements

### Phase 2
- [ ] Add "Watch Ad for 10 More Swipes" option
- [ ] Implement referral program (invite friends = free swipes)
- [ ] Daily free swipe refresh

### Phase 3
- [ ] Tiered pricing (Basic, Pro, Premium)
- [ ] Family plan (share Pro with 5 users)
- [ ] Student discount

### Phase 4
- [ ] Annual subscription with trial
- [ ] Enterprise/unlimited plan for photographers

## Configuration

Change the free swipe limit in `src/screens/GalleryScreen.js`:

```javascript
const FREE_SWIPES_LIMIT = 50; // Change this number
```

## Security Considerations

⚠️ **Important**: Current implementation uses AsyncStorage which can be modified by users with rooted/jailbroken devices.

For production:
1. Store pro status on server
2. Validate receipts server-side
3. Use encrypted storage for sensitive data
4. Implement fraud detection

## Support

For payment integration help:
- RevenueCat: https://www.revenuecat.com/docs
- Stripe: https://stripe.com/docs/mobile
- Apple IAP: https://developer.apple.com/in-app-purchase/
- Google Play: https://developer.android.com/google/play/billing

---

**Status**: ✅ Free tier implemented, ready for payment integration
