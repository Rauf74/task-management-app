# Task Management App

Aplikasi manajemen tugas bergaya Kanban dengan fitur kolaborasi real-time.

## Tech Stack

### Frontend
- **Next.js 16** - Framework React dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utility-first
- **Shadcn/ui** - Komponen UI modern

### Backend
- **Express.js** - REST API server
- **Clean Architecture** - Layered architecture (routes → controllers → services → repositories)
- **Socket.io** - Kolaborasi real-time
- **Prisma 7** - ORM type-safe dengan driver adapter
- **PostgreSQL** - Database (Supabase)
- **JWT** - Autentikasi dengan HttpOnly cookies
- **Zod** - Validasi input
- **Swagger** - API documentation

## Struktur Proyek

```
task-management/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/        # Auth pages
│       │   └── (dashboard)/   # Protected pages
│       ├── components/ui/     # Shadcn components
│       └── lib/               # API client, auth context
├── backend/
│   └── src/
│       ├── controllers/       # HTTP handlers
│       ├── services/          # Business logic
│       ├── repositories/      # Database queries
│       ├── routes/            # API endpoints
│       ├── middleware/        # Auth, validation
│       └── socket/            # Real-time events
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

Server: http://localhost:4000 | API Docs: http://localhost:4000/api/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

## Progress

### Backend
| Feature | Status |
|---------|--------|
| Express.js + TypeScript + Socket.io | ✅ |
| Clean Architecture | ✅ |
| Prisma 7 + Supabase PostgreSQL | ✅ |
| JWT Authentication | ✅ |
| Swagger API documentation | ✅ |
| Workspace CRUD API | ✅ |
| Board CRUD API | ✅ |
| Column CRUD API + reorder | ✅ |
| Task CRUD API + move | ✅ |
| Socket.io real-time events | ✅ |

### Frontend Pages
| Page | Route | Status |
|------|-------|--------|
| Login | `/login` | ✅ |
| Register | `/register` | ✅ |
| Dashboard (Workspace List) | `/` | ✅ |
| Workspace Detail | `/workspaces/:id` | 🔜 |
| Board View | `/boards/:id` | 🔜 |
| Drag & Drop Tasks | - | 🔜 |
| Real-time Updates | - | 🔜 |

### DevOps
| Feature | Status |
|---------|--------|
| Docker | 🔜 |
| CI/CD (GitHub Actions) | 🔜 |
| Deploy ke AWS | 🔜 |

## Creator

**Abdur Rauf Al Farras**
- GitHub: [@Rauf74](https://github.com/Rauf74)
