# SuperSports - Live Sports Streaming Platform

A full-stack sports streaming platform built with Vue.js 3 and Node.js, featuring live streaming with HLS, real-time chat, subscription management, and multiple payment providers.

## Features

- **Live Streaming**: HLS video player with real-time streaming support
- **Live Chat**: Real-time chat on stream pages
- **Subscription System**: Monthly and seasonal subscription plans
- **Payment Integration**: Stripe, BTCPay Server, NOWPayments (crypto)
- **Admin Dashboard**: Full content management system
- **User Management**: Registration, authentication, profile management
- **Season & Stream Management**: Organize streams by seasons

## Tech Stack

### Frontend
- Vue.js 3 (Composition API)
- Vite
- Tailwind CSS
- Pinia (State Management)
- Vue Router
- HLS.js (Video Player)
- Axios

### Backend
- Node.js + Express
- Prisma ORM
- SQLite (easily switchable to PostgreSQL)
- JWT Authentication
- bcrypt

## Project Structure

```
supersports/
├── frontend/                # Vue.js frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── views/           # Page components
│   │   ├── views/admin/     # Admin dashboard pages
│   │   ├── stores/          # Pinia stores
│   │   ├── composables/     # Vue composables
│   │   └── router/          # Vue Router config
│   └── public/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   └── config/          # Configuration
│   └── prisma/              # Database schema & seeds
└── vercel.json              # Vercel deployment config
```

## Deployment Instructions

### Option 1: Deploy Frontend to Vercel + Backend to Railway/Render

#### Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure:
   - **Framework Preset**: Vue.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
5. Deploy

#### Backend (Railway)

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select the `backend` folder
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://...  (Railway provides this)
   JWT_SECRET=your-super-secret-key
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
5. Deploy

#### Backend (Render)

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `npm start`
5. Add environment variables (same as Railway)

### Option 2: Local Development

#### Prerequisites
- Node.js 18+
- npm or yarn

#### Backend Setup

```bash
cd supersports/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

#### Frontend Setup

```bash
cd supersports/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:3000`.

### Option 3: Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## Default Accounts

After running the seed script:

| Email | Password | Role |
|-------|----------|------|
| admin@supersports.com | admin123 | Admin |
| user@example.com | user123 | User |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user
- `PUT /api/auth/profile` - Update profile

### Seasons
- `GET /api/seasons` - List all seasons
- `GET /api/seasons/:id` - Get season details
- `POST /api/seasons` - Create season (admin)
- `PUT /api/seasons/:id` - Update season (admin)
- `DELETE /api/seasons/:id` - Delete season (admin)

### Streams
- `GET /api/streams` - List all streams
- `GET /api/streams/:id` - Get stream (includes access check)
- `GET /api/streams/:id/chat` - Get chat messages
- `POST /api/streams/:id/chat` - Send chat message
- `PATCH /api/streams/:id/live` - Toggle live status (admin)

### Plans & Subscriptions
- `GET /api/plans` - List subscription plans
- `POST /api/subscriptions/checkout` - Create checkout session
- `GET /api/subscriptions/my` - Get user's subscriptions
- `POST /api/subscriptions/grant` - Grant access (admin)

## Payment Setup

### Stripe
1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Set `STRIPE_SECRET_KEY` in backend .env
3. Set up webhook endpoint: `https://your-backend.com/api/subscriptions/webhook/stripe`
4. Set `STRIPE_WEBHOOK_SECRET` from webhook settings

### BTCPay Server
1. Deploy BTCPay Server or use a hosted instance
2. Create a store and get API key
3. Set `BTCPAY_URL`, `BTCPAY_STORE_ID`, `BTCPAY_API_KEY`

### NOWPayments
1. Sign up at [nowpayments.io](https://nowpayments.io)
2. Get API key from dashboard
3. Set `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET`

## Switching to PostgreSQL

1. Update `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL` in .env:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

3. Run migrations:
   ```bash
   npx prisma db push
   ```

## License

MIT
