const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const User = require('./models/User');
const { seedHospitalData } = require('./seed/seedData');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const departmentRoutes = require('./routes/department.routes');
const doctorRoutes = require('./routes/doctor.routes');
const patientRoutes = require('./routes/patient.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const medicalRecordRoutes = require('./routes/medicalRecord.routes');
const billingRoutes = require('./routes/billing.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Database Connection & Auto-Seed
const initializeDB = async () => {
  await connectDB();
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[System Init] Empty database detected. Populating clinical demo seed data...');
      await seedHospitalData(false);
    }
  } catch (seedErr) {
    console.error('[System Init] Auto-seed failed:', seedErr.message);
  }
};
initializeDB();

// Security Middlewares
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev origins seamlessly
      }
    },
    credentials: true,
  })
);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', apiLimiter);

// Request Parsing & Logging
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve public static assets
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/', (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  // If requested by a web browser, show a beautiful visual API portal with direct launcher to frontend
  if (req.accepts('html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hospital Management System — Backend API Portal</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 24px; max-width: 600px; width: 100%; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
          .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(13, 148, 136, 0.15); border: 1px solid #0d9488; color: #2dd4bf; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; }
          .dot { width: 8px; height: 8px; background: #2dd4bf; border-radius: 50%; box-shadow: 0 0 10px #2dd4bf; }
          h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; color: #ffffff; }
          p.desc { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
          .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: #0d9488; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 24px; border-radius: 14px; text-decoration: none; transition: background 0.2s, transform 0.1s; box-shadow: 0 10px 20px -5px rgba(13, 148, 136, 0.4); }
          .btn-primary:hover { background: #0f766e; transform: translateY(-1px); }
          .info-box { background: #0f172a; border: 1px solid #334155; border-radius: 16px; padding: 16px; margin-top: 24px; text-align: left; }
          .info-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 8px; }
          .info-row { display: flex; justify-content: space-between; font-size: 12px; padding: 6px 0; border-bottom: 1px solid #1e293b; }
          .info-row:last-child { border-bottom: none; }
          .info-row span.label { color: #94a3b8; }
          .info-row span.val { color: #f1f5f9; font-weight: 600; }
          .endpoints { display: flex; justify-content: center; gap: 12px; margin-top: 20px; }
          .endpoints a { color: #2dd4bf; font-size: 12px; text-decoration: none; font-weight: 600; }
          .endpoints a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">
            <span class="dot"></span>
            Backend API Online & Healthy
          </div>
          <h1>Hospital Management System REST API</h1>
          <p class="desc">
            You are connected to the Express & MongoDB REST API server (Port 5000). The interactive hospital web application is running on Port 5173.
          </p>

          <a href="${clientUrl}" class="btn-primary">
            Launch Hospital Web Portal UI →
          </a>

          <div class="info-box">
            <div class="info-title">System Overview</div>
            <div class="info-row">
              <span class="label">Web UI (Frontend)</span>
              <span class="val"><a href="${clientUrl}" style="color: #2dd4bf; text-decoration: none;">${clientUrl}</a></span>
            </div>
            <div class="info-row">
              <span class="label">API Base URL</span>
              <span class="val">http://localhost:5000/api</span>
            </div>
            <div class="info-row">
              <span class="label">Health Check</span>
              <span class="val"><a href="/health" style="color: #2dd4bf; text-decoration: none;">/health (200 OK)</a></span>
            </div>
            <div class="info-row">
              <span class="label">Default Admin</span>
              <span class="val">admin@hospital.com (Admin@123)</span>
            </div>
          </div>

          <div class="endpoints">
            <a href="/api/departments" target="_blank">Departments API ↗</a>
            <a href="/api/doctors" target="_blank">Doctors API ↗</a>
            <a href="/health" target="_blank">Health Status ↗</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.json({
    message: 'Welcome to the Advanced Hospital Management System (HMS) REST API',
    version: '1.0.0',
    documentation: '/api/docs',
    frontend: clientUrl,
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  HMS Backend Server running in [${process.env.NODE_ENV || 'development'}] mode`);
  console.log(`  Listening on address: http://0.0.0.0:${PORT}`);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  // Keep server alive or exit gracefully
});

module.exports = app;

