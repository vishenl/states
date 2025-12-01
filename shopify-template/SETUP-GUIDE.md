# Shopify Theme Development Setup Guide

## Quick Start

This guide will help you get the Shopify theme development server running on your local machine.

## Prerequisites

- ✅ Shopify CLI installed (you already have this)
- ⚠️  A Shopify store (development store or production)
- ⚠️  Shopify account with access to the store

---

## Option 1: I Already Have a Shopify Store

If you have a Shopify store, follow these steps:

### Step 1: Run the Setup Script

```bash
cd /Users/maxsaad/Desktop/mindvalley/states/shopify-template
./start-dev-server.sh
```

### Step 2: Enter Your Store URL

When prompted, enter your store URL (e.g., `mindvalley-states.myshopify.com`)

### Step 3: Authenticate

The CLI will provide:
- A verification code (e.g., `SHKV-FXLG`)
- A URL to visit

1. Click the URL or copy it to your browser
2. Log in to your Shopify account
3. Enter the verification code when prompted
4. Authorize the Shopify CLI

### Step 4: Access Your Theme

Once authenticated, the dev server will start and provide a preview URL like:
```
Preview your theme: http://127.0.0.1:9292
```

Open that URL in your browser to see your theme!

---

## Option 2: I Don't Have a Shopify Store Yet

You need to create a free development store.

### Step 1: Create a Shopify Partner Account

1. Visit: https://partners.shopify.com/signup
2. Fill in your details
3. Verify your email
4. Complete the partner account setup

### Step 2: Create a Development Store

1. Log in to your Partner Dashboard: https://partners.shopify.com
2. Click **Stores** in the left sidebar
3. Click **Add store**
4. Select **Development store**
5. Fill in the store details:
   - Store name: `mindvalley-states` (or your preference)
   - Store purpose: **Test and build**
   - Select: **Test theme or app extensions**
6. Click **Create development store**

### Step 3: Get Your Store URL

After creating the store, note the store URL. It will be in the format:
```
your-store-name.myshopify.com
```

### Step 4: Run the Setup Script

Now follow the steps from **Option 1** above.

---

## Quick Commands Reference

### Start Development Server
```bash
./start-dev-server.sh
```

### Or manually:
```bash
shopify theme dev --store=your-store.myshopify.com
```

### Push Theme to Store
```bash
shopify theme push --store=your-store.myshopify.com
```

### Check Theme List
```bash
shopify theme list --store=your-store.myshopify.com
```

---

## Troubleshooting

### Error: "A store is required"
- Make sure you've provided your store URL
- Check that the URL is in the format: `store-name.myshopify.com`

### Error: "Authentication failed"
- Clear your browser cache
- Try the authentication process again
- Make sure you're logging in with the correct Shopify account

### Port Already in Use
If port 9292 is busy:
```bash
shopify theme dev --store=your-store.myshopify.com --port=9293
```

### Theme Not Updating
- Hard refresh your browser (Cmd+Shift+R on Mac)
- Check the terminal for error messages
- Make sure the dev server is still running

---

## What Happens When You Run the Dev Server?

1. **Authentication**: First time only, you'll authenticate with Shopify
2. **Theme Upload**: Your local theme files are synced to a draft theme
3. **Local Server**: A local server starts (default: http://127.0.0.1:9292)
4. **Live Reload**: Changes you make locally are instantly reflected
5. **Store Preview**: You see your theme with real store data

---

## Next Steps

Once your dev server is running:

1. Open the preview URL in your browser
2. Make changes to any file in the `shopify-template` folder
3. Save the file
4. Refresh your browser to see changes (or use live reload)

Happy theming! 🎨

