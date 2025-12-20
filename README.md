# Task Management App

A full-stack Kanban-style task management application with real-time collaboration.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Shadcn/ui** - Modern UI components

### Backend
- **Express.js** - REST API server
- **Socket.io** - Real-time collaboration
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database
- **JWT** - Authentication with HttpOnly cookies

## Project Structure

```
task-management-app/
├── frontend/     # Next.js application
├── backend/      # Express.js API server
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Neon)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Rauf74/task-management-app.git
cd task-management-app
```

2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
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

## Features

- [ ] User authentication (register, login)
- [ ] Workspace management
- [ ] Board management with columns
- [ ] Task cards with drag & drop
- [ ] Real-time collaboration (Socket.io)
- [ ] Priority and due date management

## Author

**Abdur Rauf Al Farras**
- GitHub: [@Rauf74](https://github.com/Rauf74)
