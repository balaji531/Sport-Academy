# Sport Faction — Backend API

Node.js / Express / MongoDB backend for the Sport Faction sports club management app.

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 2. Install dependencies
```bash
cd server
npm install
```

### 3. Configure environment
Copy `.env` and fill in your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sport_faction
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

CLIENT_URL=http://localhost:5173
```

### 4. Seed the database (first run only)
```bash
node src/seed.js
```
This creates:
| Role    | Email                        | Password      |
|---------|------------------------------|---------------|
| Admin   | admin@sportfaction.in        | Admin@1234    |
| Student | student@sportfaction.in      | Student@1234  |
| Member  | member@sportfaction.in       | Member@1234   |

### 5. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs on **http://localhost:5000**

---

## Frontend setup
In `client/.env`, make sure:
```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```
The frontend Vite dev server proxies `/api` requests — see `vite.config.js`.
If the proxy isn't configured, add this to `client/vite.config.js`:
```js
server: {
  proxy: {
    '/api': 'http://localhost:5000',
  },
},
```

---

## API Reference

### Auth  `/api/auth`
| Method | Path             | Auth | Description           |
|--------|------------------|------|-----------------------|
| POST   | /register        | —    | Register new user     |
| POST   | /login           | —    | Login, returns JWT    |
| GET    | /me              | ✅   | Get current user      |
| PUT    | /profile         | ✅   | Update profile        |

### Bookings  `/api/bookings`
| Method | Path                  | Auth   | Description              |
|--------|-----------------------|--------|--------------------------|
| GET    | /availability         | —      | Check slot availability  |
| GET    | /my                   | ✅     | My bookings              |
| GET    | /all                  | Admin  | All bookings             |
| POST   | /                     | ✅     | Create booking           |
| PUT    | /:id/confirm          | ✅     | Confirm after payment    |
| PUT    | /:id/cancel           | ✅     | Cancel booking           |

### Payments  `/api/payments`
| Method | Path           | Auth  | Description             |
|--------|----------------|-------|-------------------------|
| POST   | /create-order  | ✅    | Create Razorpay order   |
| POST   | /verify        | ✅    | Verify payment          |
| GET    | /history       | ✅    | Own payment history     |
| GET    | /all           | Admin | All payments            |

### Events  `/api/events`
| Method | Path              | Auth  | Description             |
|--------|-------------------|-------|-------------------------|
| GET    | /                 | —     | List events             |
| GET    | /:id              | —     | Get event details       |
| POST   | /                 | Admin | Create event            |
| PUT    | /:id              | Admin | Update event            |
| DELETE | /:id              | Admin | Delete event            |
| POST   | /:id/enroll       | ✅    | Enroll in event         |
| POST   | /:id/gallery      | Admin | Upload gallery images   |

### Memberships  `/api/memberships`
| Method | Path      | Auth  | Description              |
|--------|-----------|-------|--------------------------|
| GET    | /plans    | —     | Get all plans + pricing  |
| GET    | /my       | ✅    | My active membership     |
| GET    | /all      | Admin | All memberships          |
| POST   | /purchase | ✅    | Purchase a plan          |

### Attendance  `/api/attendance`
| Method | Path            | Auth  | Description              |
|--------|-----------------|-------|--------------------------|
| GET    | /my             | ✅    | My attendance + stats    |
| GET    | /student/:id    | Admin | Student attendance       |
| POST   | /               | Admin | Mark attendance          |
| POST   | /bulk           | Admin | Bulk mark attendance     |

### Notifications  `/api/notifications`
| Method | Path         | Auth  | Description              |
|--------|--------------|-------|--------------------------|
| GET    | /my          | ✅    | My notifications         |
| PUT    | /:id/read    | ✅    | Mark one as read         |
| PUT    | /read-all    | ✅    | Mark all as read         |
| POST   | /send        | Admin | Broadcast notification   |

### Admin  `/api/admin`
| Method | Path                     | Auth  | Description              |
|--------|--------------------------|-------|--------------------------|
| GET    | /stats                   | Admin | Dashboard stats          |
| GET    | /users                   | Admin | List users (search/filter)|
| PUT    | /users/:id               | Admin | Update user              |
| DELETE | /users/:id               | Admin | Deactivate user          |
| PUT    | /users/:id/fee-status    | Admin | Update fee status        |

---

## Real-time (Socket.IO)
The server runs Socket.IO on the same port.
- Client joins their own room: `socket.emit('join', userId)`
- Server emits `notification` events to a user's room on booking confirms, fee reminders, etc.

---

## Tech Stack
- **Express 4** — HTTP server
- **Mongoose 8** — MongoDB ODM
- **Socket.IO 4** — Real-time notifications
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Razorpay** — Payment gateway
- **Multer** — File uploads (event gallery)
