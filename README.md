# Task Management App

Aplikasi manajemen tugas bergaya Kanban dengan fitur kolaborasi real-time.

## Tech Stack

### Frontend
- **Next.js 16** - Framework React dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling utility-first
- **Shadcn/ui** - Komponen UI modern

### Backend
- **Express.js** - REST API server
- **Socket.io** - Kolaborasi real-time
- **Prisma** - ORM type-safe
- **PostgreSQL** - Database relasional
- **JWT** - Autentikasi dengan HttpOnly cookies

## Struktur Proyek

```
task-management-app/
├── frontend/     # Aplikasi Next.js
├── backend/      # Server API Express.js
└── README.md
```

## Cara Menjalankan

### Prasyarat
- Node.js 20+
- Database PostgreSQL (atau Neon)

### Instalasi

1. Clone repository
```bash
git clone https://github.com/Rauf74/task-management-app.git
cd task-management-app
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan kredensial database Anda
npx prisma migrate dev
npm run dev
```

3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Fitur

- [ ] Autentikasi pengguna (register, login)
- [ ] Manajemen workspace
- [ ] Manajemen board dengan kolom
- [ ] Kartu tugas dengan drag & drop
- [ ] Kolaborasi real-time (Socket.io)
- [ ] Manajemen prioritas dan deadline

## Penulis

**Abdur Rauf Al Farras**
- GitHub: [@Rauf74](https://github.com/Rauf74)
