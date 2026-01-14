# Task Management App

Aplikasi manajemen tugas bergaya Kanban dengan fitur kolaborasi real-time.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - Framework React dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling utility-first
- **Shadcn/ui** - Komponen UI modern
- **@dnd-kit** - Drag & Drop
- **Socket.io Client** - Real-time updates
- **next-themes** - Dark/Light mode

### Backend
- **Express.js** - REST API server
- **Clean Architecture** - Layered architecture (routes → controllers → services → repositories)
- **Socket.io** - Kolaborasi real-time
- **Prisma 7** - ORM type-safe dengan driver adapter
- **PostgreSQL** - Database (Supabase)
- **JWT** - Autentikasi dengan HttpOnly cookies
- **Zod** - Validasi input
- **Swagger** - API documentation

## 📁 Struktur Proyek

```
task-management/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/           # Login, Register
│       │   └── (dashboard)/      # Workspace, Board pages
│       ├── components/
│       │   ├── ui/               # Shadcn components
│       │   └── board/            # Kanban components
│       └── lib/                  # API, contexts, utils
├── backend/
│   └── src/
│       ├── controllers/          # HTTP handlers
│       ├── services/             # Business logic
│       ├── repositories/         # Database queries
│       ├── routes/               # API endpoints
│       ├── middleware/           # Auth, validation
│       └── socket/               # Real-time events
└── README.md
```

## 🎨 Features

- ✅ **Authentication** - Register, Login with Email/Username, Logout (JWT)
- ✅ **Workspace Management** - Buat, edit, hapus workspace
- ✅ **Board Management** - Kanban boards dalam workspace
- ✅ **Column Management** - Kolom untuk mengorganisir task
- ✅ **Task Management** - CRUD task dengan priority
- ✅ **Drag & Drop** - Pindahkan task antar kolom
- ✅ **Real-time Updates** - Socket.io untuk kolaborasi
- ✅ **Dark/Light Mode** - Theme toggle dengan ColorHunt palette
- ✅ **Delete Confirmation** - Dialog konfirmasi sebelum hapus
- ✅ **Responsive UI** - Mobile-friendly layout
- ✅ **Glassmorphism Auth** - Modern login/register pages

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login dengan email/username |
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

## 🛠️ Cara Menjalankan

### Prasyarat
- Node.js 20+
- Database PostgreSQL (Supabase/Neon)
- Docker (optional)

### Dengan Docker (Recommended)
```bash
# Copy environment file
cp .env.example .env
# Edit .env dengan DATABASE_URL dan JWT_SECRET

# Jalankan semua services
docker-compose up --build
```

App: http://localhost | API Docs: http://localhost/api/docs

### Tanpa Docker

#### Backend
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

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:3000

## 📊 Progress

### Backend
| Feature | Status |
|---------|--------|
| Express.js + TypeScript + Socket.io | ✅ |
| Clean Architecture | ✅ |
| Prisma 7 + Supabase PostgreSQL | ✅ |
| JWT Authentication | ✅ |
| Login with Email/Username | ✅ |
| Swagger API documentation | ✅ |
| Workspace CRUD API | ✅ |
| Board CRUD API | ✅ |
| Column CRUD API + reorder | ✅ |
| Task CRUD API + move | ✅ |
| Socket.io real-time events | ✅ |

### Frontend
| Feature | Status |
|---------|--------|
| Login & Register (Glassmorphism) | ✅ |
| Dashboard (Workspace List) | ✅ |
| Workspace Detail Page | ✅ |
| Board View (Kanban) | ✅ |
| Drag & Drop Tasks | ✅ |
| Real-time Updates (Socket.io) | ✅ |
| Dark/Light Mode Toggle | ✅ |
| Edit Task Dialog | ✅ |
| Delete Confirmation Dialogs | ✅ |
| Priority Select (Create & Edit) | ✅ |
| Responsive Mobile Layout | ✅ |

### DevOps
| Feature | Status |
|---------|--------|
| Dockerfile frontend | ✅ |
| Dockerfile backend | ✅ |
| docker-compose.yml | ✅ |
| Nginx reverse proxy | ✅ |
| GitHub Actions CI/CD | ✅ |
| E2E Testing (Playwright) | ✅ |
| Deploy ke AWS EC2 | 🔜 |

## 📸 Screenshots

*Coming soon*

## 👤 Creator

**Abdur Rauf Al Farras**
- GitHub: [@Rauf74](https://github.com/Rauf74)

