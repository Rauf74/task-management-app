# Task Management App

Aplikasi manajemen tugas bergaya Kanban dengan fitur kolaborasi real-time.

## Tech Stack

### Frontend
- **Next.js 15** - Framework React dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **Shadcn/ui** - Komponen UI modern

### Backend
- **Express.js** - REST API server
- **Socket.io** - Kolaborasi real-time
- **Prisma 7** - ORM type-safe dengan driver adapter
- **PostgreSQL** - Database (Supabase)
- **JWT** - Autentikasi dengan HttpOnly cookies
- **Zod** - Validasi input
- **Swagger** - API documentation

## Struktur Proyek

```
task-management/
├── frontend/          # Aplikasi Next.js
├── backend/           # Server API Express.js
│   ├── src/
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database queries
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, validation
│   │   ├── socket/        # Real-time events
│   │   └── lib/           # Prisma, Swagger
│   └── prisma/            # Database schema
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Workspace
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | List workspaces |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces/:id` | Get workspace detail |
| PUT | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |

### Board
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces/:id/boards` | List boards |
| POST | `/api/workspaces/:id/boards` | Create board |
| GET | `/api/boards/:id` | Get board with columns & tasks |
| PUT | `/api/boards/:id` | Update board |
| DELETE | `/api/boards/:id` | Delete board |

### Column
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/boards/:id/columns` | Create column |
| PUT | `/api/columns/:id` | Update column |
| DELETE | `/api/columns/:id` | Delete column |
| PATCH | `/api/columns/reorder` | Reorder columns |

### Task
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/columns/:id/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/move` | Move task |

## Cara Menjalankan

### Prasyarat
- Node.js 20+
- Database PostgreSQL (Supabase/Neon)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan kredensial database
npx prisma generate
npx prisma db push
npm run dev
```

Server berjalan di: http://localhost:4000

API Docs: http://localhost:4000/api/docs

### Frontend (Coming Soon)
```bash
cd frontend
npm install
npm run dev
```

## Progress

- [x] Monorepo structure (frontend + backend)
- [x] Express.js + TypeScript + Socket.io setup
- [x] Prisma 7 dengan Supabase PostgreSQL
- [x] JWT Authentication (register, login, logout)
- [x] Swagger API documentation
- [x] Workspace CRUD API
- [x] Board CRUD API
- [x] Column CRUD API + reorder
- [x] Task CRUD API + move
- [x] Socket.io real-time events
- [ ] Frontend dengan Next.js + Shadcn/ui
- [ ] Drag & drop tasks
- [ ] Docker + CI/CD
- [ ] Deploy ke AWS

## Penulis

**Abdur Rauf Al Farras**
- GitHub: [@Rauf74](https://github.com/Rauf74)
