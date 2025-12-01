#!/bin/bash

# Shopify Theme Development Server Startup Script
# This script helps you start the local development server for your Shopify theme

echo "🛍️  Shopify Theme Development Server Setup"
echo "=========================================="
echo ""

# Check if SHOPIFY_FLAG_STORE is set
if [ -z "$SHOPIFY_FLAG_STORE" ]; then
    echo "⚠️  No store configured."
    echo ""
    echo "Please provide your Shopify store URL:"
    echo "Example: mindvalley-states.myshopify.com"
    echo ""
    read -p "Enter your store URL: " STORE_URL
    
    if [ -z "$STORE_URL" ]; then
        echo "❌ No store URL provided. Exiting."
        exit 1
    fi
    
    export SHOPIFY_FLAG_STORE="$STORE_URL"
    
    # Save to .env file for future use
    echo "SHOPIFY_FLAG_STORE=$STORE_URL" > .env
    echo "✅ Store URL saved to .env file"
else
    echo "✅ Using store: $SHOPIFY_FLAG_STORE"
fi

echo ""
echo "🚀 Starting Shopify theme development server..."
echo "📝 Note: You may need to authenticate with Shopify on first run"
echo ""

# Start the development server
shopify theme dev --store="$SHOPIFY_FLAG_STORE"

