const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();

// Express CORS Configuration for Client URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/owner', ownerRoutes);

// Root Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Roxiler Store Rating API Server is running smoothly',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Centralized Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
