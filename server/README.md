# Roxiler Store Rating Platform - Express.js REST API Backend

Modular Node.js/Express.js REST API server with MongoDB (Mongoose ODM), JWT authentication, role-based security middleware, and comprehensive admin/owner/user endpoints.

---

## 📌 Tech Stack & Security

- **Server Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Token (JWT) Bearer tokens
- **Password Security**: `bcryptjs` password hashing with salt
- **CORS**: Configured for `http://localhost:5173`
- **Environment Management**: `dotenv`

---

## 🛠️ Installation & Setup

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables (.env)
Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/roxiler_store_rating
JWT_SECRET=roxiler_store_rating_jwt_secret_key_2026
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database with Realistic Test Data
```bash
npm run seed
```

### 4. Start Development API Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

---

## 🔑 Demo Login Credentials (Post-Seed)

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **System Admin** | `admin.sterling@roxiler.com` | `Admin@Password123` | Full admin dashboard, user/store CRUD, analytics |
| **Store Owner** | `beatrice.vance@apexelectronics.com` | `Owner@Password123` | Store owner dashboard, rating breakdown for owned store |
| **Normal User** | `alexander.harrison@example.com` | `User@Password123` | Browse stores, submit/update 1-5 star ratings, change password |

---

## 📑 API Endpoint Documentation

### Auth Routes (`/api/auth`)
- `POST /api/auth/register`: Public registration for Normal Users.
- `POST /api/auth/login`: Authenticates credentials & returns JWT token + user profile.
- `GET /api/auth/me`: Returns logged in user profile (Requires JWT).
- `PUT /api/auth/change-password`: Modifies account password (Requires JWT).

### Normal User & Stores Routes (`/api/stores` & `/api/users`)
- `GET /api/stores`: Lists stores with search, filter, and user rating status (Requires JWT).
- `GET /api/stores/:id`: Returns store details & rating distribution (Requires JWT).
- `POST /api/stores/:id/rating`: Submits or updates 1–5 star rating for target store (Requires `NORMAL_USER`).
- `GET /api/users/me/ratings`: Ratings submitted by logged in user (Requires `NORMAL_USER`).
- `GET /api/users/me/dashboard`: Dynamic normal user metrics, unrated stores list, & recent activity (Requires `NORMAL_USER`).

### Store Owner Routes (`/api/owner`)
- `GET /api/owner/store`: Returns owned store object (Requires `STORE_OWNER`).
- `GET /api/owner/dashboard`: Returns owner store average rating, total count, rating distribution bars, & reviews log (Requires `STORE_OWNER`).
- `GET /api/owner/ratings`: Returns customer reviews for owner's store (Requires `STORE_OWNER`).

### System Admin Routes (`/api/admin`)
- `GET /api/admin/dashboard`: Returns platform statistics, recent ratings, & analytics chart datasets (Ratings over time, Users by role donut, Store rating distribution bars) (Requires `ADMIN`).
- `GET /api/admin/users`: Lists users with search, role filter, & sorting (Requires `ADMIN`).
- `GET /api/admin/users/:id`: User details with role metadata (Requires `ADMIN`).
- `POST /api/admin/users`: Creates user across any role (`ADMIN`, `STORE_OWNER`, `NORMAL_USER`) (Requires `ADMIN`).
- `GET /api/admin/stores`: Lists stores with search & sorting (Requires `ADMIN`).
- `POST /api/admin/stores`: Creates store & links owner (Requires `ADMIN`).
- `GET /api/admin/stores/:id`: Store details (Requires `ADMIN`).
