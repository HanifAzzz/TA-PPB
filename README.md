# 🛠️ Haniforge — PC Builder & Compatibility Checker PWA

> **Tagline:** *Build Your Dream PC, Within Your Budget.*

Haniforge adalah Progressive Web App (PWA) berbasis web yang membantu pengguna merakit PC secara virtual, menganalisis kompatibilitas antar-komponen, dan menyesuaikan rakitan berdasarkan anggaran.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 🧩 **Katalog Komponen** | 40+ komponen dari 8 kategori (CPU, Motherboard, RAM, GPU, Storage, PSU, Casing, Cooler) |
| 🛠️ **PC Builder / Simulasi** | Pilih 1 komponen per kategori, hitung total harga otomatis, pantau sisa anggaran |
| 🔍 **Analisis Kompatibilitas** | Periksa 7+ aturan kompatibilitas nyata (socket, RAM type, form factor, panjang GPU, TDP PSU, dll.) |
| 💰 **Manajemen Anggaran** | Peringatan otomatis jika anggaran terlampaui + rekomendasi komponen pengganti |
| 💾 **Simpan & Kelola Rakitan** | Simpan, lihat detail, dan hapus rakitan ke database PostgreSQL |
| 📱 **PWA** | Installable, service worker, offline fallback, manifest |
| 🌐 **Responsif** | Berfungsi di desktop (sidebar), tablet, dan smartphone (bottom nav) |

---

## 🏗️ Teknologi

> **Bahasa Pemrograman Utama:** **JavaScript (ES6+)** di seluruh frontend dan backend.
> Tidak menggunakan TypeScript, Next.js, Flutter, Expo, maupun React Native.
> Platform target adalah **Progressive Web App (PWA)** berbasis web.

**Frontend:**
- JavaScript (ES6+) dengan ekstensi `.js` dan `.jsx`
- React.js v19 + Vite
- Tailwind CSS (desain dark mode kustom)
- React Router DOM v6
- Axios
- Lucide React (ikon)

**Backend:**
- Node.js (JavaScript)
- Express.js (REST API modular)
- node-postgres (`pg`)

**Database:**
- PostgreSQL (kompatibel dengan Neon Database / Supabase)
- Fallback: **Embedded Memory Store** otomatis jika DATABASE_URL belum diatur

**Fitur Progressive Web App (PWA):**
- **Web App Manifest** (`manifest.json`): Nama aplikasi, tema, icon maskable, shortcuts
- **Service Worker** (`sw.js`): Caching aset statis (HTML, CSS, JS, SVG, PNG)
- **Cache Storage API**: Stale-while-revalidate & cache-first strategy
- **Offline Mode**: Halaman fallback offline & banner deteksi koneksi otomatis
- **Installable Application**: Tombol pasang langsung (Add to Home Screen / Desktop PWA)
- **Responsive Design**: Tampilan desktop (sidebar) dan smartphone (bottom navigation bar)

---

## 📁 Struktur Folder

```
haniforge/
├── frontend/
│   ├── public/
│   │   ├── icons/           # PWA icons (SVG, PNG)
│   │   ├── manifest.json    # PWA manifest
│   │   └── sw.js            # Service Worker
│   ├── src/
│   │   ├── components/      # UI components (Logo, Card, Nav, dll.)
│   │   ├── pages/           # Halaman aplikasi
│   │   ├── layouts/         # AppLayout (sidebar + bottom nav)
│   │   ├── services/        # api.js (Axios client)
│   │   ├── hooks/           # useBuilder, useToast contexts
│   │   ├── utils/           # helpers.js (format Rupiah, kategori, dll.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js        # PostgreSQL + embedded fallback
│   │   ├── controllers/     # componentController, buildController, dll.
│   │   ├── routes/          # Express router per resource
│   │   ├── services/        # compatibilityService, recommendationService
│   │   ├── middleware/      # errorHandler.js
│   │   └── server.js        # Express app + entrypoint
│   ├── database/
│   │   ├── schema.sql       # DDL PostgreSQL
│   │   └── initDb.js        # Script inisialisasi DB
│   ├── seed/
│   │   ├── componentsData.js # Data komponen demo (40+ items)
│   │   └── seed.js          # Script seed database
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Cara Instalasi & Menjalankan

### Prasyarat
- Node.js v18+ (diuji dengan v24)
- npm v9+
- Akun Neon Database (opsional; tanpa DATABASE_URL, embedded store digunakan)

---

### 1. Clone / Unduh Proyek

```bash
git clone https://github.com/[username]/haniforge.git
cd haniforge
```

---

### 2. Setup Backend

```bash
cd backend
npm install

# Salin .env.example menjadi .env
copy .env.example .env
# Kemudian edit .env dan isi DATABASE_URL jika menggunakan Neon
```

**Jalankan backend:**
```bash
npm run dev
# Server berjalan di http://localhost:5000
```

> **Catatan:** Jika `DATABASE_URL` belum diatur atau kosong, backend otomatis menggunakan **Embedded Storage** (in-memory) dengan seed data 40+ komponen. Aplikasi tetap berfungsi penuh!

---

### 3. Setup Frontend

```bash
cd frontend
npm install

# Salin .env.example (opsional, sudah ada default localhost)
copy .env.example .env
```

**Jalankan frontend:**
```bash
npm run dev
# App terbuka di http://localhost:5173
```

---

## 🌐 Konfigurasi Neon Database

1. Daftar di [https://neon.tech](https://neon.tech) dan buat project baru.
2. Salin **Connection String** (format: `postgresql://user:password@host/dbname?sslmode=require`).
3. Buka `backend/.env` dan isi:
   ```env
   DATABASE_URL=postgresql://neondb_owner:xxx@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Jalankan `npm run dev` di backend — skema akan dibuat otomatis dan data komponen akan di-seed jika tabel masih kosong.

Untuk seed ulang secara manual:
```bash
cd backend
npm run db:seed
```

---

## 📡 Dokumentasi API

**Base URL:** `http://localhost:5000`

### Components

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/components` | Daftar semua komponen (filter: `category`, `search`, `minPrice`, `maxPrice`) |
| `GET` | `/api/components/:id` | Detail komponen berdasarkan ID |
| `GET` | `/api/components/category/:category` | Komponen berdasarkan kategori |
| `POST` | `/api/components` | Tambah komponen baru |
| `PUT` | `/api/components/:id` | Update komponen |
| `DELETE` | `/api/components/:id` | Hapus komponen |

### Builds

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/builds` | Daftar semua rakitan |
| `GET` | `/api/builds/:id` | Detail rakitan + item + analisis kompatibilitas |
| `POST` | `/api/builds` | Buat rakitan baru |
| `PUT` | `/api/builds/:id` | Update rakitan |
| `DELETE` | `/api/builds/:id` | Hapus rakitan |

### Compatibility

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/compatibility/check` | Analisis kompatibilitas + budget |

**Request Body `/api/compatibility/check`:**
```json
{
  "components": {
    "cpu": { "id": 1, "name": "...", "price": 1650000, "specifications": { "socket": "AM4", "tdp": 65 } },
    "motherboard": { ... },
    "ram": { ... },
    ...
  },
  "budget": 10000000
}
```

### Dashboard

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Statistik ringkasan (total komponen, build, kategori, dll.) |

---

## 📱 Build & Deploy PWA

### Build Frontend untuk Produksi

```bash
cd frontend
npm run build
# Output di frontend/dist/
```

**Deploy ke Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel
vercel --cwd frontend
```

**Deploy ke Netlify:**
```bash
# Install Netlify CLI
npm i -g netlify-cli
netlify deploy --dir=frontend/dist --prod
```

### Deploy Backend

Backend dapat di-deploy ke:
- **Railway:** connect GitHub repo, set `DATABASE_URL` env var
- **Render:** Web Service, set `start` command: `node src/server.js`
- **Heroku / Fly.io / VPS:** standard Node.js deployment

Jangan lupa set environment variables:
```
DATABASE_URL=postgresql://...
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

---

## ⚠️ Disclaimer Data

> Seluruh data komponen pada Haniforge adalah **katalog demo/contoh** untuk keperluan demonstrasi aplikasi. Harga yang ditampilkan **bukan harga pasar terkini** dan tidak berasal dari web scraping atau API berbayar. Gunakan toko komputer resmi untuk referensi harga aktual.

---

## 👨‍💻 Pengembang

| Field | Value |
|---|---|
| Nama | [Nama Pengembang] |
| NIM | [NIM] |
| Institusi | [Nama Universitas] |
| Tahun | 2024 |

> *Ganti placeholder di atas dan di `frontend/src/pages/ProfilePage.jsx` dengan informasi Anda.*

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan akademis dan non-komersial dengan menyertakan atribusi.
