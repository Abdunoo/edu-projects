#!/bin/bash

# Set frontend environment variables
# Replace with your actual backend URL

BACKEND_URL="https://server-dna94gyxx-abdundev-gmailcoms-projects.vercel.app"

echo "Setting frontend environment variables..."
echo "Backend URL: $BACKEND_URL"
echo ""

cd web

echo "Setting NUXT_PUBLIC_API_BASE..."
echo "$BACKEND_URL" | vercel env add NUXT_PUBLIC_API_BASE production

echo "Setting NUXT_API_BASE..."
echo "$BACKEND_URL/api" | vercel env add NUXT_API_BASE production

echo "Setting NUXT_PUBLIC_WS_URL..."
echo "wss://${BACKEND_URL#https://}/dashboard" | vercel env add NUXT_PUBLIC_WS_URL production

echo ""
echo "✅ Environment variables set!"
echo "Now redeploy frontend: vercel --prod"
