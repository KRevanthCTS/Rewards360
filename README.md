# Rewards360

Rewards 360 is typically designed as a comprehensive rewards and loyalty management platform. The goal of the system is to help organizations engage customers or employees through personalized rewards, points, and benefits. It provides a 360‑degree view of user interactions, preferences, and reward history.
Below is a structured explanation you can confidently use in project discussions or documentation.

🎯 1. What is Rewards 360?
Rewards 360 is an end‑to‑end loyalty and rewards management solution that helps organizations:

Track user activities
Award loyalty points
Manage rewards catalogs
Provide offers, redemptions, and personalized benefits
Improve customer engagement using analytics

Rewards360 is a two-part web application (Spring Boot backend + Vite + React frontend) for managing loyalty programs: admins create and manage offers and monitor fraud/analytics; users browse and redeem offers using points and view transactions/redemptions.

---

## Table of Contents

- Overview & Purpose
- Key Features
- System Architecture
- Design Principles
- Technology Stack
- Module Overview
- Project Structure
- Installation & Setup (Windows / PowerShell)
- Run (backend & frontend)
- API Endpoints (Admin, Auth, User, Fraud)
- Validation Rules
- Testing
- Troubleshooting
- Contribution Guidelines
- Next Steps / Roadmap

---

## Overview & Purpose

Purpose

- Provide a maintainable loyalty platform enabling:
  - Admin workflows to create, schedule, publish/unpublish and delete offers.
  - Basic fraud/monitoring dashboards for admins.
  - User workflows to browse offers, redeem with points, and track transactions and redemptions.

Audience

- Product managers / marketers (create campaigns)
- Admin operators (manage offers & monitor)
- End users (redeem rewards, check balance & history)

---

## Key Features

- Create offers with scheduling and tier targeting.
- Publish / Unpublish (toggle) and delete offers.
- Frontend + server-side validation for critical fields (dates, costPoints).
- Fraud/monitoring UI: alerts, anomalies, transaction view, audit.
- User flows: browse offers, redeem, view profile/transactions/redemptions.
- Clean module separation: backend (API) and frontend (SPA).

---

## System Architecture (high level)

- Client (React SPA)
  - UI rendering, client-side validation, token storage, API calls.
- Backend (Spring Boot REST API)
  - Authentication, offer management, business logic, validation, persistence.
- Database (H2 for dev / SQL Server for production example)
- Security: token-based auth (JWT or similar), role checks for admin endpoints.
- Optional: Email provider for OTP/reset, analytics pipelines.

Sequence examples

1. Admin creates an offer from admin UI → POST /admin/offers.
2. Backend validates and stores offer.
3. Users fetch available offers → GET /offers; redeem by calling POST /offers/{id}/redeem.

---

## Design Principles

- API-first and server-authoritative validation.
- Single responsibility: controllers/services/repositories each do one job.
- Progressive enhancement: accessible forms and clear feedback.
- Small surface area for easier testing and review.

---

## Technology Stack

Backend

- Java (JDK 17+ recommended)
- Spring Boot, Spring MVC, Spring Security
- Maven
- JPA/Hibernate
- SQL database (H2, SQL Server example)

Frontend

- React (Vite)
- Axios (API client)
- React Router
- Plain CSS / page-specific CSS files

Dev / Tools

- Node.js, npm (or yarn)
- Maven
- Optional: Postman, Swagger/OpenAPI

---

## Module Overview

backend/

- Controllers: `AuthController`, `AdminController`, `UserController`, etc.
- Services: business logic
- Repositories: JPA interfaces
- Models/DTOs: entities and API shapes
- Resources: `application.properties`, `data.sql`

frontend/

- `src/pages/admin` — `OffersAdmin.jsx`, `FraudMonitor.jsx`, `Promotions.jsx`
- `src/pages/auth` — `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `OtpVerify.jsx`
- `src/pages/user` — `Offers.jsx`, `Dashboard.jsx`, `Profile.jsx`, `Redemptions.jsx`, `Transactions.jsx`
- `src/api/client.js` — axios client
- `src/context/UserContext.jsx` — central user context
- Styles: `src/pages/admin/offersAdmin.css`, `styles/`

---

## Project Structure (example)

```
rewards360_full_project/
├─ backend/
│  ├─ src/main/java/com/rewards360/
│  │  ├─ Rewards360Application.java
│  │  ├─ config/SecurityConfig.java
│  │  ├─ controller/
│  │  │  ├─ AuthController.java      # /api/auth/register, /api/auth/login
│  │  │  └─ UserController.java      # /api/user/me, /api/user/transactions
│  │  ├─ model/                      # User, CustomerProfile, Transaction, Role
│  │  ├─ repository/                 # UserRepository, TransactionRepository
│  │  └─ service/                    # CustomUserDetailsService
│  └─ src/main/resources/
│     ├─ application.properties      # MySQL config
│     └─ (optional) data.sql
└─ frontend/
   ├─ .env                           # VITE_API_BASE_URL=http://localhost:8080
   └─ src/
      ├─ api/client.js               # Axios base
      ├─ App.jsx                     # Router
      ├─ components/ProtectedRoute.jsx
      └─ pages/
         ├─ auth/Login.jsx
         └─ user/Dashboard.jsx
```

---

## Installation & Setup (Windows / PowerShell)

### 1) Database (MySQL)

Create DB & grant a local dev user (run once in MySQL client):

```sql
CREATE DATABASE IF NOT EXISTS rewards360;
CREATE USER IF NOT EXISTS 'rewards'@'localhost' IDENTIFIED BY 'rewards@123';
GRANT ALL ON rewards360.* TO 'rewards'@'localhost';
```

### 2) Backend

`backend/src/main/resources/application.properties` (MySQL)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rewards360?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=rewards
spring.datasource.password=rewards@123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT
app.jwt.secret=YXNka2p3ZWprYmZhc2RqazEyMzQ1Njc4OTBhYmNkZWY=
app.jwt.expiryMillis=86400000

# CORS
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=*
spring.web.cors.allowed-headers=*
```

Run:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on **http://localhost:8080**.

### 3) Frontend

`frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Run:

```bash
cd frontend
npm install
npm run dev
```

Open the app at **http://localhost:5173** (API calls go to 8080).

---

## Run (backend & frontend)

1. **Backend**: `cd backend && mvn spring-boot:run`
2. **Frontend**: `cd frontend && npm run dev`
3. Access UI: [http://localhost:5173](http://localhost:5173)

---

## API Endpoints (Admin, Auth, User, Fraud)

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **User**: `/api/user/me`, `/api/user/transactions`
- **Admin**: `/api/admin/offers`, `/api/admin/fraud`
- **Public**: `/api/offers`, `/api/transactions`

---

## Validation Rules

- **Offer dates**: start/end must be valid and in the future.
- **Cost points**: positive integer, sufficient user points for redemption.
- **User inputs**: email/phone format, password strength.

---

## Testing

- **Unit tests**: `mvn test`
- **Integration tests**: `mvn verify`
- **Frontend**: React Testing Library, Jest

---

## Troubleshooting

- **Login/Registration fails in UI**
  - Check DevTools → Network: request URL must be `http://localhost:8080/api/...`
  - Ensure `frontend/.env` has `VITE_API_BASE_URL=http://localhost:8080` and you **restarted** Vite.

- **MySQL connects but app dies with `schema.sql` error**
  - Remove/rename empty `schema.sql` and (optionally) comment out:
    ```properties
    # spring.jpa.defer-datasource-initialization=true
    # spring.sql.init.mode=always
    ```

- **JDK 24 + Lombok build error (`TypeTag :: UNKNOWN`)**
  - Use Lombok >= **1.18.38** and set compiler `--release 17` in `pom.xml`.

- **JDBC URL shows `&amp;`**
  - Replace any `&amp;` with raw `&` in `spring.datasource.url`.

---

## Contribution Guidelines

1. **Fork the repo**: `git clone https://github.com/your-username/rewards360_full_project.git`
2. **Create a branch**: `git checkout -b feature/YourFeature`
3. **Make changes** and test locally
4. **Commit**: `git commit -m "Add some feature"`
5. **Push to your fork**: `git push origin feature/YourFeature`
6. **Create a pull request**

---

## Next Steps / Roadmap

- Enhanced fraud detection algorithms
- User behavior analytics dashboard
- Admin UI improvements: bulk offer actions, advanced filters
- Mobile app for users: browse and redeem offers on-the-go
