# 🔐 Authentication System

A full-stack MERN-based authentication system featuring user registration, email OTP verification, JWT-based session management, and a protected dashboard — all wrapped in a modern, animated UI.

---

## 🖥️ Live Preview

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Email + password login |
| Register | `/register` | Create a new account |
| Verify Email | `/verify-email` | Enter 6-digit OTP sent to email |
| Dashboard | `/dashboard` | Protected page (requires auth) |

---

## ✨ Features

- ✅ **User Registration** with username, email, and password
- ✅ **Email OTP Verification** — 6-digit OTP sent via Gmail
- ✅ **JWT Authentication** — short-lived access token (15 min) + long-lived refresh token (7 days)
- ✅ **Secure Session Management** — refresh tokens stored as SHA-256 hashes in MongoDB
- ✅ **Protected Routes** — dashboard redirects to login if unauthenticated
- ✅ **Auto Token Refresh** — access token is silently refreshed using the refresh token cookie
- ✅ **OTP Expiry** — OTPs auto-delete from DB after 10 minutes (MongoDB TTL index)
- ✅ **Resend OTP** — users can request a fresh OTP with a 60-second cooldown
- ✅ **Logout & Logout All Sessions** — session revocation support
- ✅ **Animated UI** — GSAP-powered transitions, glassmorphism design, dark theme

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express.js v5** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT (jsonwebtoken)** | Access & refresh token generation |
| **Nodemailer** | OTP email delivery via Gmail |
| **cookie-parser** | HTTP-only cookie handling |
| **cors** | Cross-origin request policy |
| **morgan** | HTTP request logging |
| **nodemon** | Dev auto-restart |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Build tool & dev server |
| **React Router DOM v7** | Client-side routing |
| **Axios** | HTTP client |
| **GSAP** | Animations & transitions |
| **Tailwind CSS v3** | Utility-first styling |
| **Three.js** | Animated background canvas |

---

## 📁 Project Structure

```
Authentication-System-/
├── backend/
│   ├── server.js                  # Entry point — starts server
│   ├── .env                       # Environment variables (not in git)
│   ├── package.json
│   └── src/
│       ├── app.js                 # Express app setup (CORS, middleware, routes)
│       ├── config/
│       │   ├── config.js          # Env validation & config export
│       │   └── database.js        # MongoDB connection
│       ├── controllers/
│       │   └── auth.controller.js # All auth logic (register, login, verify, etc.)
│       ├── models/
│       │   ├── user.model.js      # User schema (username, email, password, verified)
│       │   ├── session.model.js   # Session schema (refreshToken hash, ip, userAgent)
│       │   └── otp.model.js       # OTP schema with 10-min TTL auto-expiry
│       ├── routes/
│       │   └── auth.route.js      # All /api/auth/* routes
│       ├── services/
│       │   └── email.service.js   # Nodemailer email sending (Gmail App Password)
│       └── utils/
│           └── otp.util.js        # OTP generation & HTML email template
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx               # React root
        ├── App.jsx                # Routes + ProtectedRoute guard
        ├── pages/
        │   ├── Login.jsx          # Login page
        │   ├── Register.jsx       # Registration page
        │   ├── VerifyEmail.jsx    # OTP verification page
        │   └── Dashboard.jsx      # Protected dashboard
        ├── components/
        │   ├── AnimatedBackground.jsx  # Three.js canvas background
        │   ├── AuthCard.jsx            # Glassmorphism card wrapper
        │   ├── InputField.jsx          # Reusable styled input
        │   └── Loader.jsx              # Spinner component
        └── services/
            └── api.js             # Axios instance + all API calls
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register new user, sends OTP email |
| `POST` | `/login` | No | Login with email & password |
| `POST` | `/verify-email` | No | Verify email with OTP |
| `POST` | `/resend-otp` | No | Resend a fresh OTP to email |
| `GET` | `/refresh-token` | Cookie | Get new access token using refresh cookie |
| `GET` | `/profile` | Bearer token | Get logged-in user's profile |
| `GET` | `/logout` | Cookie | Revoke current session |
| `GET` | `/logout-all` | Cookie | Revoke all sessions for the user |

---

## 🔒 Security Design

### Password Storage
Passwords are hashed using **SHA-256** before storing in the database. Plain text passwords are never persisted.

### JWT Tokens
- **Access Token** — expires in 15 minutes, sent in API response body, stored in memory (not localStorage)
- **Refresh Token** — expires in 7 days, stored as an **HTTP-only cookie** (not accessible to JavaScript)
- **Refresh Token Hash** — only a SHA-256 hash of the refresh token is stored in MongoDB (never the raw token)

### OTP Security
- OTPs are 6-digit numeric codes generated with `otp-generator`   
- Only the **SHA-256 hash** of the OTP is stored in the database
- OTPs **auto-expire after 10 minutes** via MongoDB TTL index
- Old OTPs are deleted before a new one is created (no duplicate confusion)

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# Server
PORT=3000

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Gmail (Option 1 — Recommended: App Password)
EMAIL_USER=your@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Gmail (Option 2 — OAuth2, only if App Password not available)
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file to GitHub.** It is already listed in `.gitignore`.

### Getting a Gmail App Password
1. Enable **2-Step Verification** on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create a new App Password (name it anything, e.g. "Auth System")
4. Copy the 16-character code into `EMAIL_APP_PASSWORD`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with 2FA enabled

### 1. Clone the Repository

```bash
git clone https://github.com/abhiav-spec/Authentication-System-.git
cd Authentication-System-
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create your `.env` file (see [Environment Variables](#️-environment-variables) above), then start the dev server:

```bash
npm run dev
```

Backend runs at: **http://localhost:3000**

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔄 Authentication Flow

```
User Registers
     │
     ▼
Password hashed (SHA-256) → saved to DB
Refresh token → stored as hash in DB + sent as HTTP-only cookie
Access token → sent in response body (stored in memory)
OTP generated → hash saved to DB → email sent to user
     │
     ▼
User goes to /verify-email → enters OTP
OTP hash matched in DB → user.verified = true → OTP deleted
     │
     ▼
User Logs In (only works if verified)
New session created → access token + refresh token issued
     │
     ▼
Dashboard (Protected)
Access token used for API calls
If expired → auto-refresh via /refresh-token using cookie
     │
     ▼
User Logs Out
Session revoked in DB → refresh cookie cleared
```

---

## 🎨 UI Design

- **Theme:** Dark glassmorphism with `slate-950` background
- **Accent colors:** Cyan → Emerald gradients (primary), Rose → Orange (logout)
- **Animations:** GSAP-powered card entrances, staggered inputs, shake on error, scale on hover
- **Background:** Animated Three.js particle canvas
- **Typography:** System sans-serif with Tailwind's font utilities

---

## 📦 Scripts

### Backend
```bash
npm run dev      # Start with nodemon (auto-restart on changes)
npm start        # Start with node (production)
```

### Frontend
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 🐛 Known Issues Fixed

| Issue | Root Cause | Fix |
|---|---|---|
| OTP email not sending | OAuth2 refresh token expired | Switched to Gmail App Password |
| 400 on `/verify-email` | `unique: true` on OTP email field caused duplicate key crash | Removed unique constraint, added `deleteMany` before insert |
| Stale email transporter | Module-level singleton cached broken OAuth2 transporter | Fresh transporter created per `sendEmail()` call |

---

## 👨‍💻 Author

**Abhinav Kumar**  
GitHub: [@abhiav-spec](https://github.com/abhiav-spec)

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
