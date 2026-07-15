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
├── DEPLOY.md                     # Catatan teknis & checklist rilis
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

## 📡 Daftar Lengkap API Endpoints

Semua endpoint dilindungi oleh middleware autentikasi (cookie JWT), kecuali endpoint publik (register, login, dan root).

### 🔐 Autentikasi & Profil (`/api/auth`)
| Method | Endpoint | Deskripsi | Status Akses |
|--------|----------|-----------|--------------|
| POST | `/api/auth/register` | Mendaftarkan akun baru (langsung login) | Publik |
| POST | `/api/auth/login` | Masuk menggunakan Email atau Username | Publik |
| POST | `/api/auth/logout` | Menghapus session cookie JWT | Terproteksi |
| GET | `/api/auth/me` | Mengambil info profil pengguna yang aktif | Terproteksi |
| PATCH | `/api/auth/me` | Memperbarui nama/username profil | Terproteksi |
| POST | `/api/auth/change-password` | Mengganti password pengguna | Terproteksi |

### 📁 Workspace (`/api/workspaces`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/workspaces` | Mengambil seluruh daftar workspace pengguna |
| POST | `/api/workspaces` | Membuat workspace baru |
| GET | `/api/workspaces/:id` | Mengambil info detail workspace beserta board di dalamnya |
| PUT | `/api/workspaces/:id` | Memperbarui info nama/deskripsi workspace |
| DELETE | `/api/workspaces/:id` | Menghapus workspace beserta isinya |
| GET | `/api/workspaces/:id/analytics` | Mengambil data statistik/analitik workspace |
| GET | `/api/workspaces/:id/activities` | Mengambil daftar riwayat aktivitas workspace |

### 📋 Papan Kanban (`/api/boards`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/workspaces/:workspaceId/boards` | Membuat papan board baru di dalam workspace |
| GET | `/api/boards/:id` | Memuat data detail papan beserta kolom dan kartu tugas |
| PUT | `/api/boards/:id` | Mengubah nama/deskripsi papan board |
| DELETE | `/api/boards/:id` | Menghapus papan board |
| POST | `/api/boards/:boardId/columns` | Membuat kolom baru di dalam papan board |

### 📑 Kolom Papan (`/api/columns`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| PUT | `/api/columns/:id` | Mengubah nama/judul kolom papan |
| DELETE | `/api/columns/:id` | Menghapus kolom beserta tugas di dalamnya |
| PATCH | `/api/columns/reorder` | Menyimpan urutan baru susunan kolom papan |
| POST | `/api/columns/:columnId/tasks` | Membuat kartu tugas baru di dalam kolom |

### 📌 Kartu Tugas (`/api/tasks`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| PUT | `/api/tasks/:id` | Memperbarui isi tugas (judul, prioritas, deadline, label) |
| DELETE | `/api/tasks/:id` | Menghapus kartu tugas |
| PATCH | `/api/tasks/:id/move` | Memindahkan kartu tugas ke kolom lain/posisi lain |

### 🏷️ Label / Tag (`/api/workspaces`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/workspaces/:workspaceId/labels` | Mengambil daftar label di dalam workspace |
| POST | `/api/workspaces/:workspaceId/labels` | Membuat label baru di dalam workspace |
| DELETE | `/api/workspaces/labels/:id` | Menghapus label berdasarkan ID |

---

## 🛠️ Pembelajaran Penting & Troubleshooting (Studi Kasus Proyek)

Bagian ini merangkum masalah nyata yang dihadapi selama pengembangan dan bagaimana solusinya, sangat berguna untuk bahan belajar kamu nantinya:

### 1. Masalah Cookie Cross-Origin (CORS Auth) di Production
- **Masalah**: Setelah rilis, pengguna tidak bisa login karena cookie JWT diblokir browser saat frontend (Vercel) mengirim request ke backend (Render).
- **Pembelajaran**: Karena domain frontend dan backend berbeda, cookie JWT wajib menggunakan konfigurasi `sameSite: "none"` dan `secure: true`. Hal ini membutuhkan koneksi HTTPS penuh dan pemetaan parameter CORS `allowedOrigins` yang presisi tanpa menyisipkan *trailing slash* (`/`) di akhir domain.

### 2. Isu `sql_require_primary_key` pada Database Aiven MySQL
- **Masalah**: Saat menjalankan migrasi skema tabel database melalui Prisma CLI, database Aiven menolak pembuatan tabel.
- **Pembelajaran**: Platform cloud terkelola seperti Aiven MySQL mewajibkan setiap tabel memiliki Primary Key secara default demi keamanan replikasi. Karena tabel perantara Prisma (seperti tabel relasi banyak-ke-banyak implicit) sering kali tidak mendefinisikannya secara langsung, opsi `sql_require_primary_key` harus dinonaktifkan (`OFF`) pada dashboard konfigurasi lanjut Aiven.

### 3. File Config pada Engine Prisma 7 & Docker Container
- **Masalah**: Aplikasi crash di Docker production dengan pesan error bahwa engine Prisma tidak menemukan database datasource.
- **Pembelajaran**: Pada Prisma 7.x, pemetaan connection string menggunakan berkas konfigurasi baru bernama `prisma.config.ts`. Pada Dockerfile *Multi-stage build*, file ini wajib disalin ke kontainer tahap akhir (`Stage 2: runner`), bukan hanya file skema `.prisma` saja.

### 4. Halaman Swagger UI Kosong/Beku di Production
- **Masalah**: Dokumentasi Swagger dapat dibuka namun accordion API-nya kosong dan tidak merespon saat diklik.
- **Pembelajaran**: 
  1. **Aset Hilang**: Kontainer Docker production hanya menyalin folder `dist/` (compiled JS). `swagger-jsdoc` sebelumnya diarahkan ke file TypeScript di `src/routes/*.ts` yang tidak ada di production. Solusinya adalah mengarahkan pencarian JSDoc ke file JS kompilasi (`dist/routes/*.js`).
  2. **Interferensi Helmet CSP**: Kebijakan keamanan default dari Helmet memblokir eksekusi *inline script* Swagger. Solusinya adalah menonaktifkan Content Security Policy khusus (`contentSecurityPolicy: false`) pada opsi inisialisasi Helmet agar komponen interaktif Swagger diizinkan berjalan oleh browser.

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
