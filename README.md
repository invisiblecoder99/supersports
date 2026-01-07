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
- SQLite/PostgreSQL
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

---

## Railway Deployment (Recommended)

Deploy both frontend and backend on Railway with one project.

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and login
2. Click **New Project** → **Deploy from GitHub repo**
3. Select `supersports` repository

### Step 2: Deploy Backend

1. Click **Add Service** → **GitHub Repo** → Select `supersports`
2. In service settings:
   - **Root Directory**: `backend`
   - **Start Command**: `npx prisma db push && npm start`
3. Add **PostgreSQL** database:
   - Click **Add Service** → **Database** → **PostgreSQL**
4. Set environment variables (click on backend service → Variables):

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.up.railway.app

# Payment (optional - add when ready)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
BTCPAY_URL=
BTCPAY_STORE_ID=
BTCPAY_API_KEY=
NOWPAYMENTS_API_KEY=
NOWPAYMENTS_IPN_SECRET=
```

5. Deploy and note the backend URL (e.g., `https://supersports-backend.up.railway.app`)

### Step 3: Deploy Frontend

1. Click **Add Service** → **GitHub Repo** → Select `supersports`
2. In service settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
3. Set environment variables:

```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

4. Deploy

### Step 4: Update CORS

After both are deployed, update backend's `FRONTEND_URL` to match your frontend URL.

### Step 5: Seed Database (Optional)

1. Open backend service in Railway
2. Go to **Settings** → **Run Command**
3. Run: `node prisma/seed.js`

Or connect to the service shell and run the seed script.

---

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup

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

### Frontend Setup

```bash
cd supersports/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:3000`.

---

## Default Accounts

After running the seed script:

| Email | Password | Role |
|-------|----------|------|
| admin@supersports.com | admin123 | Admin |
| user@example.com | user123 | User |

---

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="file:./dev.db"                    # SQLite (dev)
# DATABASE_URL="postgresql://user:pass@host:5432/db"  # PostgreSQL (prod)

# Auth
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# BTCPay Server
BTCPAY_URL=""
BTCPAY_STORE_ID=""
BTCPAY_API_KEY=""

# NOWPayments
NOWPAYMENTS_API_KEY=""
NOWPAYMENTS_IPN_SECRET=""
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api    # Dev
# VITE_API_URL=https://api.yourdomain.com/api  # Prod
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/users` - List users (admin)

### Seasons
- `GET /api/seasons` - List all seasons
- `GET /api/seasons/:id` - Get season details
- `GET /api/seasons/:id/streams` - Get season streams
- `POST /api/seasons` - Create season (admin)
- `PUT /api/seasons/:id` - Update season (admin)
- `DELETE /api/seasons/:id` - Delete season (admin)

### Streams
- `GET /api/streams` - List all streams
- `GET /api/streams/:id` - Get stream (includes access check)
- `GET /api/streams/:id/chat` - Get chat messages
- `POST /api/streams/:id/chat` - Send chat message (auth)
- `POST /api/streams` - Create stream (admin)
- `PUT /api/streams/:id` - Update stream (admin)
- `PATCH /api/streams/:id/live` - Toggle live status (admin)
- `DELETE /api/streams/:id` - Delete stream (admin)

### Plans & Subscriptions
- `GET /api/plans` - List subscription plans
- `POST /api/subscriptions/checkout` - Create checkout session
- `GET /api/subscriptions/my` - Get user's subscriptions
- `POST /api/subscriptions/grant` - Grant access (admin)
- `GET /api/subscriptions/admin/all` - List all subscriptions (admin)

---

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

---

## Payment Setup

### Stripe
1. Get API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Set `STRIPE_SECRET_KEY` in backend .env
3. Set up webhook: `https://your-backend.com/api/subscriptions/webhook/stripe`
4. Set `STRIPE_WEBHOOK_SECRET`

### BTCPay Server
1. Deploy BTCPay Server or use hosted instance
2. Create store and get API key
3. Set `BTCPAY_URL`, `BTCPAY_STORE_ID`, `BTCPAY_API_KEY`

### NOWPayments
1. Sign up at [nowpayments.io](https://nowpayments.io)
2. Get API key
3. Set `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET`

---

## License

MIT
