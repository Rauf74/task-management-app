# Deployment TaskScale

## Arsitektur

```
Frontend (Next.js) → Vercel
Backend (Express)  → Render (Docker Web Service)
Database (MariaDB) → Aiven MySQL
```

## Prasyarat produksi

- Tambahkan custom domain `taskscale.site` dan/atau `www.taskscale.site` di Vercel.
- Gunakan URL Render untuk `NEXT_PUBLIC_API_URL`; Vercel tidak meneruskan request `/api/*` ke backend secara otomatis.
- Gunakan secret baru yang dibuat di secret manager atau environment platform; jangan pernah menaruh nilainya di dokumentasi atau repository.

## 1. Database — Aiven MySQL/MariaDB

### Setup
- Bikin akun di https://console.aiven.io
- Create service → MySQL → Free plan (1 CPU, 1GB RAM, 1GB storage)
- Region: pilih terdekat
- Tunggu provisioning (5-10 menit)

### Connection string
Dapet format:
```
mysql://avnadmin:PASSWORD@HOST:PORT/defaultdb?ssl-mode=REQUIRED
```

### Penting
> **Aiven punya `sql_require_primary_key=ON` secara default.**
> Di Aiven Console → Service settings → Advanced configuration → set `sql_require_primary_key` → **OFF**.
> Kalau tidak, Prisma gagal bikin tabel.

## 2. Backend — Render Web Service (Docker)

### Setup
1. Buka https://render.com → Dashboard → New Web Service
2. Connect GitHub repo `task-management-app`
3. Root directory: `backend/`
4. Runtime: **Docker**
5. Port: **4000**

### Environment Variables
| Key | Value |
|-----|-------|
| `DATABASE_URL` | `mysql://avnadmin:pass@host:11426/defaultdb?ssl-mode=REQUIRED` |
| `JWT_SECRET` | String acak minimal 32 karakter, dibuat di dashboard platform |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://www.taskscale.site,https://taskscale.site` (gunakan hostname yang benar-benar aktif) |
| `PORT` | `4000` |

### Catatan Penting
- `prisma.ts` pake `@prisma/adapter-mariadb` dengan manual URL parsing. Query parameter `ssl-mode=REQUIRED` HARUS di-handle manual di kode (tambahan `ssl: { rejectUnauthorized: false }` ke adapter config).
- `prisma.config.ts` pake `DATABASE_URL` (bukan `DIRECT_URL`) untuk Prisma CLI.
- Jika Redis tidak tersedia, aplikasi memakai memory adapter; untuk multi-instance gunakan Redis managed.
- `health check` endpoint: `/api/health`

### Migrasi Database
Jalanin sekali dari lokal:
```bash
cd backend
DATABASE_URL="mysql://avnadmin:pass@host:11426/defaultdb?ssl-mode=REQUIRED" \
  npx prisma db push --accept-data-loss
```

Atau deploy dengan `start.sh` yang isinya:
```bash
npx prisma db push --accept-data-loss
node dist/index.js
```

## 3. Frontend — Vercel

### Setup
1. Buka https://vercel.com → Import Repository
2. Pilih repo `task-management-app`
3. Root directory: `frontend/`
4. Framework: **Next.js**
5. Build command: `npm ci && npm run build`

### Environment Variables
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://task-scale-backend.onrender.com` |

### Catatan
- Vercel otomatis handle SSL, custom domain, no sleep. Gratis.
- Render (Node runtime) untuk Next.js gagal karena memory 512MB limit. Vercel handle lebih baik.

## 4. CORS

### Backend
`app.ts` memakai `FRONTEND_URL` untuk CORS origin. Nilai di Docker Compose dan backend harus menggunakan nama variabel yang sama:
```env
FRONTEND_URL=https://task-scale-frontend.vercel.app
```
> **Pastikan tanpa trailing slash** — Render yang pake `/` bikin CORS error.

### Socket.io
Juga pake `FRONTEND_URL` untuk CORS socket. Sama, tanpa trailing slash.

## 5. File Penting

| File | Fungsi |
|------|--------|
| `backend/src/lib/prisma.ts` | Prisma client singleton + adapter MariaDB |
| `backend/prisma.config.ts` | Konfig Prisma CLI 7.x (URL untuk migration) |
| `backend/prisma/schema.prisma` | Schema database (User, Workspace, Board, Column, Task, Label, Activity) |
| `backend/Dockerfile` | Multi-stage build untuk Render Docker runtime |
| `frontend/next.config.ts` | `output: 'standalone'` untuk Next.js |
| `frontend/Dockerfile` | Multi-stage build dengan arg `NEXT_PUBLIC_API_URL` |

## 6. Checklist rilis

- [x] `https://task-scale-backend.onrender.com/api/health` merespons `200`.
- [x] `https://task-scale-backend.onrender.com/api/docs` dapat dibuka.
- [x] Register, login, dan logout berfungsi dari domain publik.
- [x] Socket.io berhasil tersambung setelah login.
- [x] Domain Vercel memakai HTTPS valid dan `FRONTEND_URL` di Render tanpa trailing slash.

## 7. Masalah yang Udah Kejadian & Fix

### a. Docker build out of memory di Render
Render free tier (512MB) gagal build Next.js. Solusi: pindah frontend ke Vercel.

### b. Port mismatch Docker
Dockerfile `EXPOSE 3000` tapi Render default `PORT=10000`. Solusi: set `PORT=3000` di env vars.

### c. SSL Aiven self-signed certificate
Kode `prisma.ts` parse URL manual tapi query param SSL diabaikan. Solusi: tambah `ssl: { rejectUnauthorized: false }` ke `PrismaMariaDb` adapter.

### d. sql_require_primary_key
Aiven MySQL default `ON`. Prisma gagal bikin tabel. Solusi: disable via Aiven Dashboard → Advanced Configuration.

### e. CORS trailing slash
`FRONTEND_URL` pake `https://site.com/` (dengan slash). Browser kirim origin tanpa slash. Jadi mismatch. Solusi: hapus trailing slash.

## 8. Todo

- [x] Matiin `sql_require_primary_key` di Aiven dashboard (Terbukti aman/sudah nonaktif)
- [x] Jalanin `prisma db push` sekali buat bikin tabel (Sudah sukses dijalankan via lokal)
- [x] Set `FRONTEND_URL` ke hostname publik yang dipakai frontend (Sudah diatur ke domain custom).
- [x] Set `NEXT_PUBLIC_API_URL` di Vercel ke URL backend Render, lalu redeploy frontend (Sudah dikonfigurasi).
