# TaskScale - Task Management App

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-taskscale.site-blueviolet?style=for-the-badge)](https://taskscale.site)
[![API Docs](https://img.shields.io/badge/📚_API_Docs-Swagger-green?style=for-the-badge)](https://task-scale-backend.onrender.com/api/docs)

Aplikasi manajemen tugas kolaboratif bergaya Kanban dengan fitur sinkronisasi real-time, drag & drop, mode gelap, manajemen label, dan riwayat aktivitas terintegrasi.

---

## 🌐 Link Hidup (Production)

- **Aplikasi (Frontend)**: [https://taskscale.site](https://taskscale.site) (Hosting: Vercel)
- **API Server & Dokumentasi (Backend)**: [https://task-scale-backend.onrender.com](https://task-scale-backend.onrender.com) (Hosting: Render)
- **Dokumentasi Interaktif (Swagger)**: [https://task-scale-backend.onrender.com/api/docs](https://task-scale-backend.onrender.com/api/docs)

---

## 🚀 Tech Stack

### Frontend (Next.js)
- **Next.js 16** (App Router) - Server Component & Client Component hybrid rendering.
- **TypeScript** - Keamanan tipe data statis.
- **Tailwind CSS v4** - Desain UI responsif berbasis utilitas.
- **Shadcn/ui & Radix UI** - Komponen UI yang aksesibel dan modern.
- **@dnd-kit** - Pustaka Drag & Drop responsif (mendukung desktop & mobile touch).
- **Socket.io Client** - Sinkronisasi data real-time antar kolaborator.
- **next-themes** - Penanganan sistem tema gelap/terang.

### Backend (Node.js & Express)
- **Express.js** - REST API server yang cepat dan minimalis.
- **Socket.io** - WebSocket server untuk event real-time.
- **Prisma 7 & MariaDB Adapter** - ORM type-safe untuk pemetaan objek database.
- **JWT (JSON Web Token)** - Autentikasi aman melalui HttpOnly & Secure cookie.
- **Zod** - Validasi skema input request body.
- **Helmet.js** - Keamanan HTTP headers.
- **Rate Limiting** - Perlindungan brute-force (300 request per 15 menit).

### Database & DevOps
- **Aiven MySQL** - Database relasional cloud terkelola (Free Tier).
- **Vercel** - Deployment frontend otomatis dengan SSL HTTPS.
- **Render** - Deployment backend berbasis Docker container.
- **Docker & Docker Compose** - Containerization lingkungan lokal.

---

## 📁 Struktur Proyek (Arsitektur Bersih)

Proyek ini dipisahkan menjadi dua bagian utama demi fleksibilitas deployment:
```
task-management/
├── frontend/                     # Next.js Frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/           # Form Login & Register
│       │   └── (dashboard)/      # Layout Utama, Workspace, & Papan Board
│       ├── components/
│       │   ├── ui/               # Komponen dasar Shadcn
│       │   ├── board/            # Komponen kartu & kolom Kanban
│       │   └── dashboard/        # Hero, Feed Aktivitas, dll
│       └── lib/                  # Auth Context, API fetcher, Socket provider
├── backend/                      # Node.js Express Backend
│   └── src/
│       ├── controllers/          # Handler HTTP request/response
│       ├── services/             # Logika bisnis (business logic)
│       ├── repositories/         # Akses database terisolasi (queries)
│       ├── routes/               # Pemetaan endpoint API
│       ├── middleware/           # Validasi Zod & verifikasi Auth
│       └── socket/               # Handler WebSocket
├── docker-compose.yml            # Multi-container setup lokal
└── README.md
```

---

## 🎨 Fitur Utama & Keamanan

- **Autentikasi Ganda**: Pendaftaran & Masuk akun menggunakan Email atau Username.
- **Real-time Collaboration**: Perubahan posisi kartu tugas langsung tersinkronisasi ke layar pengguna lain tanpa refresh.
- **Drag & Drop Mulus**: Pemindahan tugas antar-kolom yang presisi di komputer maupun HP.
- **Riwayat Aktivitas Terintegrasi**: Log aktivitas tersinkronisasi di dashboard dan di ikon navigasi global navbar.
- **Manajemen Label**: Pemberian tag warna (misal: Bug, Feature) pada setiap tugas.
- **Secure Authentication**: Kredensial JWT disimpan di cookie browser dengan flag `HttpOnly`, `Secure`, dan `SameSite=None` untuk mencegah serangan XSS.
- **Swagger Documentation**: Dokumentasi OpenAPI 3.0 interaktif lengkap untuk seluruh endpoint API.

---

## 🏁 Menjalankan di Lokal (Development)

### Prasyarat
- Node.js versi 20 ke atas.
- Server database MySQL/MariaDB yang aktif.

### Langkah-langkah
1. **Clone repository**:
   ```bash
   git clone https://github.com/Rauf74/task-management-app.git
   cd task-management-app
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit file .env dan sesuaikan dengan DATABASE_URL lokal Anda
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Pastikan NEXT_PUBLIC_API_URL mengarah ke http://localhost:4000
   npm run dev
   ```

4. Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda.

---

## 👤 Pembuat
**Abdur Rauf Al Farras**
- GitHub: [@Rauf74](https://github.com/Rauf74)
