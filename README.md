# Job Portal — .NET Microservices

A learning-focused microservices project built with **.NET 9 Web API**, **YARP API Gateway**, **RabbitMQ**, and **Redis**, containerised with **Docker Compose**.

---

## Architecture

```
Client (Postman / Angular)
        │
        ▼
 API Gateway  :5000  (YARP)
        │
  ┌─────┼──────────────────────────────┐
  │     │              │               │
Auth  Candidate    Employer          Job
:5001   :5002        :5003           :5004
                                      │
                              Application   Resume Search
                                :5005          :5006

Infrastructure
  ├── Redis      :6379
  └── RabbitMQ   :5672  (UI: :15672)
```

---

## Services

| Service              | Port | Responsibility                                     |
|----------------------|------|----------------------------------------------------|
| **api-gateway**      | 5000 | YARP reverse proxy — single entry point            |
| **auth-service**     | 5001 | Register, Login, JWT token issuance                |
| **candidate-service**| 5002 | Candidate profile CRUD (name, skills, experience)  |
| **employer-service** | 5003 | Company / employer profile CRUD                    |
| **job-service**      | 5004 | Post jobs, search jobs by title/skill/location     |
| **application-service**| 5005 | Apply to jobs, track application status          |
| **resume-search-service**| 5006 | Search candidates by skills & experience       |
| **Redis**            | 6379 | Caching layer (ready to integrate)                 |
| **RabbitMQ**         | 5672 | Message broker (ready to integrate)                |

---

## API Routes (via Gateway on port 5000)

| Method | Gateway URL                           | Forwards to                          |
|--------|---------------------------------------|--------------------------------------|
| POST   | `/auth/api/auth/register`             | auth-service                         |
| POST   | `/auth/api/auth/login`                | auth-service                         |
| GET    | `/candidates/api/candidates`          | candidate-service                    |
| POST   | `/candidates/api/candidates`          | candidate-service                    |
| GET    | `/employers/api/employers`            | employer-service                     |
| POST   | `/employers/api/employers`            | employer-service                     |
| GET    | `/jobs/api/jobs`                      | job-service                          |
| POST   | `/jobs/api/jobs`                      | job-service                          |
| GET    | `/applications/api/applications`      | application-service                  |
| POST   | `/applications/api/applications`      | application-service                  |
| POST   | `/resume-search/api/resumesearch`     | resume-search-service                |

---

## Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Run with Docker Compose

```bash
docker-compose up --build
```

All services will start. Visit:
- **RabbitMQ UI** → http://localhost:15672  (user: `guest`, pass: `guest`)
- Individual service Swagger → e.g. http://localhost:5001/openapi/v1.json

### Run a single service locally

```bash
cd auth-service
dotnet run
```

---

## Project Structure

```
microservices/
├── api-gateway/                  # YARP reverse proxy
├── auth-service/                 # JWT auth (register/login)
│   ├── Controllers/
│   ├── Models/
│   └── Dockerfile
├── candidate-service/            # Candidate profiles
├── employer-service/             # Employer / company profiles
├── job-service/                  # Job postings
├── application-service/          # Job applications
├── resume-search-service/        # Candidate search (Elasticsearch-ready)
├── docker-compose.yml
└── JobPortal.slnx
```

---

## Learning Roadmap

- [x] Step 1 — All 6 services + API gateway scaffolded
- [x] Step 2 — JWT Auth in auth-service
- [x] Step 3 — Docker Compose with Redis + RabbitMQ
- [ ] Step 4 — Add Entity Framework Core + SQL Server (DB per service)
- [ ] Step 5 — Event-driven communication via RabbitMQ (e.g. "JobApplied" event)
- [ ] Step 6 — Add Redis caching to job-service
- [ ] Step 7 — Integrate Elasticsearch into resume-search-service
- [ ] Step 8 — Kubernetes deployment (optional)

---

## Tech Stack

| Concern            | Technology                          |
|--------------------|-------------------------------------|
| API Framework      | ASP.NET Core 9 Web API              |
| API Gateway        | YARP 2.x                            |
| Auth               | JWT Bearer (Microsoft.AspNetCore)   |
| Password Hashing   | BCrypt.Net-Next                     |
| Messaging          | RabbitMQ (ready to wire up)         |
| Caching            | Redis (ready to wire up)            |
| Containerisation   | Docker + Docker Compose             |
| Future DB          | Entity Framework Core + SQL Server  |
