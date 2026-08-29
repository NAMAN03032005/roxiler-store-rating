# Roxiler Store Rating Platform

A full-stack Web Application for store rating management featuring three distinct user roles: **System Administrator**, **Normal User**, and **Store Owner**.

---

## 📌 Development Roadmap Status

- **PHASE 1 (COMPLETED)** → React.js Frontend Setup, Components, Routing, Form Validation, Lucide Icons, Recharts Analytics, & CSS Design System.
- **PHASE 2 (COMPLETED)** → Express.js REST API Backend, Mongoose MongoDB Models, JWT Authentication, Role Authorization Middleware, & Database Seed Script.
- **PHASE 3 (PLANNED)** → PostgreSQL/MySQL Production Database Adapter.

---

## 🚀 Technology Stack

### Frontend (`/client`)
- **Framework**: [React.js](https://react.dev/) (bootstrapped with [Vite](https://vitejs.dev/))
- **Icons**: `lucide-react`
- **Charts**: `recharts`
- **Routing**: `react-router-dom` (v6)
- **HTTP Client**: `axios` (configured with `Authorization: Bearer <token>`)
- **Styling**: Modern Vanilla CSS with CSS Variables (`src/index.css`)

### Backend (`/server`)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: `bcryptjs` password hashing with salt
- **Environment**: `dotenv`
- **CORS**: Configured for `http://localhost:5173`

---

## 🛠️ Quick Start Instructions

### 1. Start the Express Backend Server (`/server`)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Seed MongoDB database with demo users, stores, and ratings
npm run seed

# Launch Express development API server
npm run dev
```
The API server will run at `http://localhost:5000`.

### 2. Start the React Frontend (`/client`)

```bash
# Open a new terminal and navigate to client folder
cd client

# Install dependencies
npm install

# Launch Vite development client server
npm run dev
```
The React application will launch at `http://localhost:5173`.

---

## 🔑 Demo Seed Accounts (Post-Seed)

| Role | Email | Password | Access Scope |
|---|---|---|---|
| 👑 **System Admin** | `admin.sterling@roxiler.com` | `Admin@Password123` | Full admin dashboard, user/store CRUD, analytics charts |
| 💼 **Store Owner** | `beatrice.vance@apexelectronics.com` | `Owner@Password123` | Store owner dashboard, rating breakdown for owned store |
| 👤 **Normal User** | `alexander.harrison@example.com` | `User@Password123` | Browse stores, submit/update 1–5 star ratings, change password |

---

## 📑 Configured REST API Endpoints

### Auth (`/api/auth`)
- `POST /api/auth/register` - Public registration for Normal Users
- `POST /api/auth/login` - Returns JWT token + user profile
- `GET /api/auth/me` - Authenticated user profile
- `PUT /api/auth/change-password` - Password update

### Stores & User Portal (`/api/stores` & `/api/users`)
- `GET /api/stores` - Search, filter, and sort stores
- `GET /api/stores/:id` - Store details & rating statistics
- `POST /api/stores/:id/rating` - Submit or update 1–5 star rating
- `GET /api/users/me/ratings` - Ratings submitted by logged in user
- `GET /api/users/me/dashboard` - Normal user dashboard metrics

### Store Owner Portal (`/api/owner`)
- `GET /api/owner/store` - Owned store object
- `GET /api/owner/dashboard` - Owner store metrics, rating distribution, & customer reviews
- `GET /api/owner/ratings` - Store reviews list

### System Admin Portal (`/api/admin`)
- `GET /api/admin/dashboard` - Platform statistics, recent ratings, & analytics chart datasets
- `GET /api/admin/users` - Searchable, sortable user listing
- `GET /api/admin/users/:id` - User profile details
- `POST /api/admin/users` - Create user across any role (`ADMIN`, `STORE_OWNER`, `NORMAL_USER`)
- `GET /api/admin/stores` - Searchable, sortable store listing
- `POST /api/admin/stores` - Create store & associate store owner
- `GET /api/admin/stores/:id` - Store details with ratings breakdown
