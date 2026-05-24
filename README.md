<div align="center">
  <img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Notebook/3D/notebook_3d.png" alt="ZenNote Logo" width="120" />
  <h1>ZenNote</h1>
  <p><strong>A Premium AI-powered Productivity Workspace</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
    <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet" alt=".NET 8" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" />
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  </p>
</div>

---

**ZenNote** is an all-in-one productivity workspace inspired by the best aspects of Notion, Linear, TickTick, and Arc Browser. Engineered with modern SaaS principles, it perfectly balances beautiful, responsive design with a highly scalable and robust architecture.

## 🚀 Key Features

- **📝 Rich Note-taking**: A block-based editor for seamless documentation.
- **✅ Task Management**: Track issues, organize sprints, and manage daily to-dos.
- **🤖 AI-Powered**: Built-in AI to summarize, generate, and organize your thoughts.
- **⚡ Real-time Sync**: Collaborative editing and instant state updates via SignalR.
- **🎨 Stunning UI**: Glassmorphism, smooth animations, and a polished Dark/Light theme system.
- **🏢 Multi-Workspace**: Isolate contexts for different projects or teams.

## 🛠️ Technology Stack

Our stack is carefully selected for performance, developer experience, and enterprise readiness:

### **Frontend**
- **Framework**: Next.js 15 (App Router) & React 19
- **Styling**: Tailwind CSS v4, shadcn/ui, Framer Motion
- **State & Data**: Zustand (Global state), TanStack Query (Server state)
- **Language**: TypeScript

### **Backend**
- **Framework**: ASP.NET Core 8 Web API
- **Architecture**: Clean Architecture, CQRS pattern (MediatR)
- **Database**: MySQL (Entity Framework Core)
- **Cache & Real-time**: Redis, SignalR
- **Security**: JWT Authentication

## 📂 Repository Structure

The project is structured logically to separate concerns and enforce clean boundaries:

```text
ZenNote/
├── 📁 architecture/     # ADRs, architecture diagrams, and system designs
├── 📁 backend/          # ASP.NET Core 8 Web API (Clean Architecture)
├── 📁 database/         # Schema definitions, seed data, and migration docs
├── 📁 docker/           # Legacy docker-compose orchestration (See root for active compose)
├── 📁 docs/             # Developer guides, AI roadmaps, and documentation
├── 📁 frontend/         # Next.js 15 Web Application
├── 📁 prompts/          # AI system prompts and generation configurations
├── 📁 rules/            # Rules for agents, linting, formatting, and architecture
└── 📁 tasks/            # Task tracking and sprint planning
```

## 🏁 Getting Started

We've made local development incredibly easy using Docker. You can run the entire stack (Database, Cache, API, and Web App) with a single command.

### Prerequisites
- Docker & Docker Compose installed on your machine.
- Ports `3000`, `5000`, `3306`, and `6379` available.

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ZenNote.git
   cd ZenNote
   ```

2. **Start the environment:**
   Run the following command at the root of the project to build and start all containers:
   ```bash
   docker-compose up -d --build
   ```
   *Note: On the first run, the Backend will automatically apply Entity Framework migrations to generate the Database tables.*

3. **Access the application:**
   - 🌐 **Frontend (Web App):** [http://localhost:3000](http://localhost:3000)
   - ⚙️ **Backend (Swagger API):** [http://localhost:5000/swagger](http://localhost:5000/swagger)

### Stop the environment
To stop the application and clean up containers (while keeping database volumes intact):
```bash
docker-compose down
```

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---
<div align="center">
  <i>Crafted with passion for modern productivity.</i>
</div>