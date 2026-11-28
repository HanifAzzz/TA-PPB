const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// DATABASE INIT (singleton promise)
// ==========================================
let dbInitPromise = null;
function ensureDbInit() {
  if (!dbInitPromise) {
    dbInitPromise = initDb().catch((err) => {
      console.warn('⚠️ InitDb error:', err.message);
    });
  }
  return dbInitPromise;
}

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.CLIENT_URL,
    /\.vercel\.app$/,
    /\.netlify\.app$/,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure DB is connected before any route runs
app.use(async (req, res, next) => {
  try {
    await ensureDbInit();
  } catch (e) {
    // handled inside initDb
  }
  next();
});

// ==========================================
// ROUTES
// ==========================================
const authRoutes = require('./routes/authRoutes');
const componentRoutes = require('./routes/componentRoutes');
const buildRoutes = require('./routes/buildRoutes');
const compatibilityRoutes = require('./routes/compatibilityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/builds', buildRoutes);
app.use('/api/compatibility', compatibilityRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Haniforge Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🛠️ Haniforge API - PC Builder & Compatibility Checker',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      components: '/api/components',
      builds: '/api/builds',
      compatibility: '/api/compatibility/check',
      dashboard: '/api/dashboard/stats',
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} tidak ditemukan di Haniforge API.`
  });
});

// Error handler middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// ==========================================
// START SERVER
// ==========================================
async function startServer() {
  try {
    await ensureDbInit();
    app.listen(PORT, () => {
      console.log('');
      console.log('🛠️  ============================================');
      console.log('    HANIFORGE BACKEND API v1.0.0');
      console.log('============================================ 🛠️ ');
      console.log(`🚀 Server berjalan di: http://localhost:${PORT}`);
      console.log('================================================');
    });
  } catch (err) {
    console.error('❌ Gagal menjalankan server:', err.message);
  }
}

if (require.main === module || !process.env.VERCEL) {
  startServer();
} else {
  ensureDbInit();
}

module.exports = app;
