# Deployment Task Management App

## Arsitektur

```
Frontend (Next.js) → Vercel (free, no sleep)
Backend (Express)  → Render (free, sleep 15min)
Database (MySQL)   → Aiven (free, 1GB)
```

## 1. Database — Aiven MySQL

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
| `JWT_SECRET` | `aMlW2MQyNdNiwlgcw0Zblb9azyxBZouzvIqwNtxlfVjxH8hl52bWeE2qEFEUu3c3` |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://task-scale-frontend.vercel.app` (isi setelah frontend jadi) |
| `PORT` | `4000` |

### Catatan Penting
- `prisma.ts` pake `@prisma/adapter-mariadb` dengan manual URL parsing. Query parameter `ssl-mode=REQUIRED` HARUS di-handle manual di kode (tambahan `ssl: { rejectUnauthorized: false }` ke adapter config).
- `prisma.config.ts` pake `DATABASE_URL` (bukan `DIRECT_URL`) untuk Prisma CLI.
- Redis error `ECONNREFUSED :::6379` aman diabaikan — app fallback ke memory adapter.
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
`app.ts` pake `FRONTEND_URL` env var untuk CORS origin. Update setelah frontend jadi:
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

## 6. Status Final

| Komponen | Platform | URL | Status |
|----------|----------|-----|--------|
| Frontend | Vercel | `https://task-scale-frontend.vercel.app` | ✅ Running |
| Backend | Render | `https://task-scale-backend.onrender.com` | ✅ Running |
| Database | Aiven | `mysql-taskscale` | ✅ Running (tabel belum dibuat) |
| Custom domain | - | - | ⏳ Belum setup |

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
- [ ] Set `FRONTEND_URL` di Render backend ke Vercel URL
- [ ] Setup custom domain (optional)
