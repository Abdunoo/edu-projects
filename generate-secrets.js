#!/usr/bin/env node

/**
 * Generate secure JWT secrets for production deployment
 * Run with: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating secure JWT secrets for production...\n');
console.log('Copy these values to your Vercel environment variables:\n');
console.log('─'.repeat(70));

const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');

console.log('\n📋 Backend Environment Variables:\n');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);
console.log(`JWT_EXPIRES_IN=15m`);
console.log(`JWT_REFRESH_EXPIRES_IN=7d`);
console.log(`PORT=3001`);

console.log('\n─'.repeat(70));
console.log('\n⚠️  IMPORTANT: Keep these secrets secure!');
console.log('   - Never commit them to version control');
console.log('   - Store them only in Vercel environment variables');
console.log('   - Use different secrets for each environment\n');
