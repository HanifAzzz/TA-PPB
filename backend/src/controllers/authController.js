const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'haniforge_secure_jwt_secret_key_2026';

// =========================================================
// REGISTER USER
// =========================================================
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama lengkap wajib diisi.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Alamat email wajib diisi.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Format alamat email tidak valid.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau langsung masuk.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default avatar based on user initials
    const initial = encodeURIComponent(name.trim());
    const avatarUrl = `https://ui-avatars.com/api/?name=${initial}&background=0B0F17&color=38BDF8&bold=true`;

    const result = await query(
      `INSERT INTO users (name, email, password, avatar_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, avatar_url, role, created_at`,
      [name.trim(), cleanEmail, hashedPassword, avatarUrl]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'Akun berhasil didaftarkan.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// LOGIN USER
// =========================================================
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await query('SELECT * FROM users WHERE LOWER(email) = $1', [cleanEmail]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password yang Anda masukkan salah.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password yang Anda masukkan salah.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      role: user.role,
      created_at: user.created_at,
    };

    return res.json({
      success: true,
      message: 'Berhasil masuk ke akun Anda.',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
}

// =========================================================
// GET CURRENT USER PROFILE
// =========================================================
async function getMe(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Autentikasi diperlukan. Silakan login terlebih dahulu.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Sesi login telah kedaluwarsa. Silakan login kembali.' });
    }

    const result = await query(
      'SELECT id, name, email, avatar_url, role, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    return res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getMe };
