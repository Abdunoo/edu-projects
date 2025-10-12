# Deploy to Vercel - Complete Guide

## Prerequisites

1. **Database**: Get PostgreSQL connection string from [Neon](https://neon.tech) or [Supabase](https://supabase.com) (free tier)
2. **Secrets**: Generate JWT secrets with `node generate-secrets.js`
3. **Vercel**: Already logged in ✓

## Important Notes

- Backend uses TypeScript path aliases (`@/*`) - fixed with `tsconfig-paths` in dependencies
- Database migrations must be run separately after deployment
- Environment variables must be set before production deployment works

## Deploy Backend

```bash
cd server
vercel

# Answer prompts:
# - Project name: edu-backend
# - Link to existing? N

# Set environment variables:
vercel env add DATABASE_URL          # Your PostgreSQL connection string
vercel env add JWT_SECRET            # From generate-secrets.js
vercel env add JWT_REFRESH_SECRET    # From generate-secrets.js
vercel env add JWT_EXPIRES_IN        # 15m
vercel env add JWT_REFRESH_EXPIRES_IN # 7d
vercel env add PORT                  # 3001

# For each variable, select: Production, Preview, Development

# Deploy to production:
vercel --prod

# Run migrations:
export DATABASE_URL="your-production-db-url"
npm run db:push
npm run db:seed  # Optional
```

**Save your backend URL**: `https://your-backend.vercel.app`

## Deploy Frontend

```bash
cd ../web
vercel

# Answer prompts:
# - Project name: edu-frontend
# - Link to existing? N

# Set environment variables (use your backend URL):
vercel env add NUXT_PUBLIC_API_BASE    # https://your-backend.vercel.app
vercel env add NUXT_API_BASE           # https://your-backend.vercel.app/api
vercel env add NUXT_PUBLIC_WS_URL      # wss://your-backend.vercel.app/dashboard

# For each variable, select: Production, Preview, Development

# Deploy to production:
vercel --prod
```

**Save your frontend URL**: `https://your-frontend.vercel.app`

## Update Backend CORS

```bash
cd ../server
vercel env add FRONTEND_URL  # https://your-frontend.vercel.app
vercel --prod
```

## Verify

- Backend: `https://your-backend.vercel.app/docs`
- Frontend: `https://your-frontend.vercel.app`
- Login: `admin@example.com` / `admin123`

## Troubleshooting

- **CORS error**: Verify FRONTEND_URL is set and redeploy backend
- **DB error**: Check DATABASE_URL and enable connection pooling
- **Build error**: Check logs with `vercel logs`
