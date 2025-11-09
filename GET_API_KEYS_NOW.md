# 🔑 Get Your API Keys - Step-by-Step Guide

Follow these steps **in order**. I'll guide you through each platform.

---

## 🎯 STEP 1: AdMob Setup (20 minutes)

### Part A: Create AdMob Account

1. **Go to AdMob:**
   - Open: https://admob.google.com/
   - Click "Sign in" (use your Google account)
   - If first time: Click "Get Started"

2. **Accept Terms:**
   - Read and accept AdMob terms
   - Click "Continue"

3. **Choose Account Type:**
   - Select "I'm a publisher" (you're showing ads)
   - Click "Continue"

4. **Enter Payment Country:**
   - Select your country
   - Click "Continue"

5. **Accept Program Policies:**
   - Check the box
   - Click "Create AdMob Account"

✅ **Account created!**

---

### Part B: Add Your App to AdMob

1. **Click "Apps" in left sidebar**

2. **Click "Add App" button**

3. **Is your app published?**
   - Select "No" (since you're launching tomorrow)
   - Click "Continue"

4. **Enter App Details:**
   - App name: `SwipeWipe` (or your app name)
   - Platform: Select "Android"
   - Click "Add"

5. **Save Your App ID:**
   ```
   You'll see: "App added successfully"
   
   Your App ID will look like:
   ca-app-pub-1234567890123456~0987654321
   
   📝 COPY THIS AND SAVE IT!
   ```

✅ **App added to AdMob!**

---

### Part C: Create Banner Ad Unit

1. **In your app page, click "Ad units" tab**

2. **Click "Get started" or "Add ad unit"**

3. **Select "Banner"**

4. **Enter Ad Unit Details:**
   - Ad unit name: `Gallery Banner`
   - Click "Create ad unit"

5. **Save Your Banner Ad Unit ID:**
   ```
   You'll see: "Ad unit created"
   
   Your Banner Ad Unit ID will look like:
   ca-app-pub-1234567890123456/1234567890
   
   📝 COPY THIS AND SAVE IT!
   ```

6. **Click "Done"**

✅ **Banner ad unit created!**

---

### Part D: Create Rewarded Video Ad Unit

1. **Click "Add ad unit" again**

2. **Select "Rewarded"**

3. **Enter Ad Unit Details:**
   - Ad unit name: `Bonus Swipes Reward`
   - Reward amount: `5` (bonus swipes)
   - Reward item: `swipes`
   - Click "Create ad unit"

4. **Save Your Rewarded Ad Unit ID:**
   ```
   You'll see: "Ad unit created"
   
   Your Rewarded Ad Unit ID will look like:
   ca-app-pub-1234567890123456/0987654321
   
   📝 COPY THIS AND SAVE IT!
   ```

5. **Click "Done"**

✅ **Rewarded ad unit created!**

---

### ✅ AdMob Complete! You should have:
- ✅ AdMob App ID: `ca-app-pub-XXXXX~XXXXX`
- ✅ Banner Ad Unit ID: `ca-app-pub-XXXXX/XXXXX`
- ✅ Rewarded Ad Unit ID: `ca-app-pub-XXXXX/XXXXX`

**Save these somewhere safe! You'll need them in a moment.**

---

## 🎯 STEP 2: Google Play Console Setup (15 minutes)

### Part A: Create Developer Account (if you don't have one)

1. **Go to Play Console:**
   - Open: https://play.google.com/console/
   - Sign in with your Google account

2. **Pay Registration Fee:**
   - One-time fee: $25
   - Enter payment details
   - Click "Continue"

3. **Complete Account Details:**
   - Developer name
   - Email address
   - Phone number
   - Click "Complete registration"

✅ **Play Console account created!**

---

### Part B: Create Your App

1. **Click "Create app"**

2. **Enter App Details:**
   - App name: `SwipeWipe` (or your name)
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
   - Check declarations boxes
   - Click "Create app"

✅ **App created in Play Console!**

---

### Part C: Create Subscription Product

1. **In left sidebar, go to: Monetize → Subscriptions**

2. **Click "Create subscription"**

3. **Enter Subscription Details:**
   - Product ID: `pro_monthly` (MUST be exactly this!)
   - Name: `Pro Monthly`
   - Description: `Unlimited swipes and ad-free experience`
   - Click "Continue"

4. **Set Pricing:**
   - Base plan ID: `monthly`
   - Billing period: `1 month`
   - Price: `$2.99` (or your currency equivalent)
   - Click "Continue"

5. **Review and Activate:**
   - Review details
   - Click "Activate"

✅ **Subscription created!**

**Important:** The product ID `pro_monthly` must match exactly in RevenueCat (next step).

---

## 🎯 STEP 3: RevenueCat Setup (25 minutes)

### Part A: Create RevenueCat Account

1. **Go to RevenueCat:**
   - Open: https://www.revenuecat.com/
   - Click "Sign up" (top right)

2. **Create Account:**
   - Enter email and password
   - Or sign up with Google
   - Verify your email

3. **Create Project:**
   - Project name: `SwipeWipe`
   - Click "Create"

✅ **RevenueCat account created!**

---

### Part B: Link Google Play Console

**First, you need to create a service account in Google Play Console:**

1. **Go to Play Console:**
   - Open: https://play.google.com/console/
   - Select your app

2. **Go to Setup → API access**

3. **Create Service Account:**
   - Click "Create new service account"
   - Click "Google Cloud Platform"
   - This opens Google Cloud Console

4. **In Google Cloud Console:**
   - Click "Create Service Account"
   - Name: `RevenueCat`
   - Click "Create and Continue"
   - Role: Select "Service Account User"
   - Click "Continue"
   - Click "Done"

5. **Create Key:**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Select "JSON"
   - Click "Create"
   - **A JSON file will download - SAVE THIS FILE!**

6. **Back in Play Console:**
   - Refresh the page
   - You should see your service account
   - Click "Grant access"
   - Under "App permissions", click "Add app"
   - Select your app
   - Under "Account permissions", enable:
     - View financial data
     - Manage orders and subscriptions
   - Click "Invite user"
   - Click "Send invitation"

✅ **Service account created!**

---

### Part C: Configure RevenueCat

1. **Back in RevenueCat Dashboard:**
   - Click "Project Settings" (gear icon)
   - Click "Google Play"

2. **Upload Service Account:**
   - Click "Upload JSON file"
   - Select the JSON file you downloaded
   - Click "Upload"

3. **Enter Package Name:**
   - Package name: `com.nischaysood.cleanswipe`
   - Click "Save"

✅ **Google Play linked to RevenueCat!**

---

### Part D: Create Product in RevenueCat

1. **Go to "Products" in left sidebar**

2. **Click "Add Product"**

3. **Enter Product Details:**
   - Product ID: `pro_monthly` (MUST match Play Console!)
   - Store: Google Play Store
   - Click "Add"

✅ **Product created!**

---

### Part E: Create Entitlement

1. **Go to "Entitlements" in left sidebar**

2. **Click "Add Entitlement"**

3. **Enter Entitlement Details:**
   - Entitlement ID: `pro` (MUST be exactly this!)
   - Display name: `Pro Access`
   - Click "Add"

4. **Attach Product to Entitlement:**
   - Click on the `pro` entitlement
   - Click "Attach products"
   - Select `pro_monthly`
   - Click "Attach"

✅ **Entitlement created and linked!**

---

### Part F: Get Your API Key

1. **Go to "Project Settings" (gear icon)**

2. **Click "API Keys" tab**

3. **Find "Google Play" section:**
   ```
   You'll see your Android API key:
   goog_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
   
   📝 COPY THIS AND SAVE IT!
   ```

✅ **RevenueCat API key obtained!**

---

## ✅ ALL DONE! You should now have:

### From AdMob:
- ✅ App ID: `ca-app-pub-XXXXX~XXXXX`
- ✅ Banner Unit ID: `ca-app-pub-XXXXX/XXXXX`
- ✅ Rewarded Unit ID: `ca-app-pub-XXXXX/XXXXX`

### From RevenueCat:
- ✅ Android API Key: `goog_XXXXX`

### From Play Console:
- ✅ Subscription created: `pro_monthly` at $2.99/month

---

## 🚀 NEXT STEP: Update Your App

Now that you have all your API keys, run this command:

```bash
./setup-production-keys.sh
```

Then paste your keys when prompted!

---

## 🆘 Troubleshooting

### "Can't find App ID in AdMob"
- Go to: Apps → Your App → App Settings
- It's at the top: "App ID: ca-app-pub-..."

### "Can't find Ad Unit IDs"
- Go to: Apps → Your App → Ad units
- Click on the ad unit
- Copy the "Ad unit ID"

### "Can't create service account"
- Make sure you're the owner of the Play Console account
- Try using Chrome browser
- Clear cache and try again

### "RevenueCat not showing API key"
- Go to: Project Settings → API Keys
- Look under "Google Play" section
- If not there, make sure you uploaded the JSON file

### "Subscription not showing in Play Console"
- Go to: Monetize → Subscriptions
- Make sure you clicked "Activate"
- Wait a few minutes and refresh

---

## 📝 Save Your Keys Here (Temporarily)

```
AdMob App ID:
_____________________________________________________________

Banner Ad Unit ID:
_____________________________________________________________

Rewarded Ad Unit ID:
_____________________________________________________________

RevenueCat Android API Key:
_____________________________________________________________
```

**Delete this section after you've updated your app!**

---

## ✅ Checklist

- [ ] AdMob account created
- [ ] App added to AdMob
- [ ] Banner ad unit created
- [ ] Rewarded ad unit created
- [ ] Play Console account created ($25 paid)
- [ ] App created in Play Console
- [ ] Subscription created (pro_monthly at $2.99)
- [ ] RevenueCat account created
- [ ] Service account created and JSON downloaded
- [ ] Google Play linked to RevenueCat
- [ ] Product created in RevenueCat (pro_monthly)
- [ ] Entitlement created in RevenueCat (pro)
- [ ] RevenueCat API key copied
- [ ] All 4 keys saved somewhere safe

---

## 🎉 Ready to Update Your App!

Once you have all 4 keys, run:

```bash
./setup-production-keys.sh
```

Then continue with the launch process!

---

**Need help? Let me know which step you're stuck on!**
