require('dotenv').config({ override: true });
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // Fix for Atlas SRV resolution over some ISPs
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes         = require('./routes/auth');
const bookingRoutes      = require('./routes/bookings');
const paymentRoutes      = require('./routes/payments');
const eventRoutes        = require('./routes/events');
const membershipRoutes   = require('./routes/memberships');
const attendanceRoutes   = require('./routes/attendance');
const notificationRoutes = require('./routes/notifications');
const adminRoutes        = require('./routes/admin');
const sportsRoutes       = require('./routes/sports');
const batchesRoutes      = require('./routes/batches');
const feesRoutes         = require('./routes/fees');
const performanceRoutes  = require('./routes/performance');
const inventoryRoutes    = require('./routes/inventory');
const reportsRoutes      = require('./routes/reports');
const settingsRoutes     = require('./routes/settings');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Attach io to req so routes can emit events
app.use((req, _res, next) => { req.io = io; next(); });

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/payments',      paymentRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/memberships',   membershipRoutes);
app.use('/api/attendance',    attendanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/sports',        sportsRoutes);
app.use('/api/batches',       batchesRoutes);
app.use('/api/fees',          feesRoutes);
app.use('/api/performance',   performanceRoutes);
app.use('/api/inventory',     inventoryRoutes);
app.use('/api/reports',       reportsRoutes);
app.use('/api/settings',      settingsRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404 handler
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

// ─── Socket.IO ───────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });
  socket.on('disconnect', () => {});
});

// ─── DB + Server Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'YES' : 'NO');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error full:', err);
    process.exit(1);
  });
