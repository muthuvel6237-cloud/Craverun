# CraveRun Launch Guide

## Separate Websites

- Main hub: `/`
- Customer website: `/food-delivery`
- Restaurant owner website: `/restaurant-partner`
- Delivery partner website: `/delivery-partner`

## Separate App Starts

- Customer app: `/customer/home`
- Restaurant partner app: `/owner/dashboard`
- Delivery partner app: `/delivery/dashboard`

Each app has its own PWA manifest:

- `frontend/public/manifest-customer.json`
- `frontend/public/manifest-partner.json`
- `frontend/public/manifest-delivery.json`

App config files are in:

- `apps/customer-app.json`
- `apps/partner-app.json`
- `apps/delivery-app.json`

## Local Setup

Backend:

```powershell
cd D:\CraveRun_MERN_Single_File\backend
copy .env.example .env
npm.cmd install
npm.cmd run dev
```

Frontend:

```powershell
cd D:\CraveRun_MERN_Single_File\frontend
copy .env.example .env
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:5173`.

## Required Production Values

Set these in backend hosting:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URLS`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `PORT`
- `HOST`

Set these in frontend hosting:

- `VITE_API_BASE_URL`
- `VITE_RAZORPAY_KEY_ID`

## Build And Test

Backend:

```powershell
cd backend
npm.cmd test
```

Frontend:

```powershell
cd frontend
npm.cmd run lint
npm.cmd run build
```

## Hosting

Recommended:

- MongoDB Atlas for database
- Render/Railway/Fly.io for backend API
- Vercel/Netlify for frontend
- Razorpay live keys for payment

After backend hosting, update `frontend/.env`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

After frontend hosting, update backend `CLIENT_URLS` with all frontend domains.

## Store Launch

These are currently installable PWA apps. For Play Store/App Store native packages, wrap each start URL using Capacitor or Trusted Web Activity with the bundle IDs from `apps/*.json`.
