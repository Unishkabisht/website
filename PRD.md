# Stayos Demo Website
## Product Requirements Document (PRD)

- **Created:** September 27, 2026
- **Timeline:** 2 Weeks
- **Team:** Gaurav (Backend) + Tanushree (Frontend) [Collaborators]
- **Repository:** New repo (`stayos-demo`)

---

## Table of Contents

1. [Project Goal](#1-project-goal)
2. [What to Build (User Flow)](#2-what-to-build-user-flow)
3. [Repository Structure & GitHub Workflow](#3-repository-structure--github-workflow)
4. [Database Design](#4-database-design)
5. [API Contract](#5-api-contract-gaurav-builds-these-exactly)
6. [Local Development](#6-local-development)
7. [Security Basics](#7-security-basics)
8. [Two-Week Timeline](#8-two-week-timeline)
9. [Definition of Done](#9-definition-of-done)

---

## 1. Project Goal

**Objective:** Build a lightweight demo website to collect emails and gather requirements from interested hotel owners.

### What We're Building

- **Landing page** - describe Stayos briefly
- **Signup/Login** - collect email and password
- **Simple form** - ask why they need it, hotel type, main problem
- **Confirmation page** - "You will be notified when live"
- **Store all data in database** for analysis

### NOT Building

Complex features, payments, bookings, admin dashboard.

---

## 2. What to Build (User Flow)

| Step | What Happens | Developer |
|------|--------------|-----------|
| 1 | User sees landing page with CTA button | Tanushree |
| 2 | Email + Password signup form | Tanushree + Gaurav |
| 3 | Role, hotel type, reason, problem form | Tanushree + Gaurav |
| 4 | Confirmation: "Coming soon" message | Tanushree |
| 5 | Data saved in database | Gaurav |

### Pages Tanushree Builds

- `index.html` - Landing page with CTA
- `signup.html` - Signup form
- `login.html` - Login form
- `questionnaire.html` - Requirements form
- `confirmation.html` - Success message

---

## 3. Repository Structure & GitHub Workflow

### Repo Setup (Gaurav Creates)

1. Create new repo `stayos-demo` on GitHub
2. Add Tanushree as collaborator (Settings → Collaborators)
3. Both clone:
   ```bash
   git clone https://github.com/YOUR_USERNAME/stayos-demo.git
   ```

### Folder Structure

```
stayos-demo/
├── frontend/
│   ├── index.html
│   ├── signup.html
│   ├── login.html
│   ├── questionnaire.html
│   ├── confirmation.html
│   ├── css/style.css
│   └── js/app.js
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env (DO NOT COMMIT)
│   ├── .gitignore
│   ├── routes/auth.js
│   ├── models/db.js
│   └── middleware/auth.js
├── .gitignore
└── README.md
```

### Git Branching Strategy

```
main (production ready)
├── feature/frontend (Tanushree's branch)
│   └── commits: add pages, CSS, forms
├── feature/backend (Gaurav's branch)
│   └── commits: APIs, database, auth
└── develop (integration branch)
```

### Git Workflow (IMPORTANT)

**Setup (Do Once):**

```bash
git checkout -b develop && git push -u origin develop
```

**Gaurav:**

```bash
git checkout -b feature/backend develop
```

**Tanushree:**

```bash
git checkout -b feature/frontend develop
```

**Both:** Commit to own branches, push regularly:

```bash
git push -u origin feature/XXX
```

**Daily Sync:** Get latest changes:

```bash
git pull origin develop
```

**When Feature Done:** Create Pull Request on GitHub, review code, merge to `develop`.

**Final:** Merge `develop` → `main` when everything is tested.

### .gitignore File (Important!)

```
node_modules/
.env
.DS_Store
*.log
```

---

## 4. Database Design

Two simple tables.

### Table: `users`

| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary key |
| email | VARCHAR(255) UNIQUE | Login email |
| password_hash | VARCHAR(255) | bcrypt hashed |
| name | VARCHAR(255) | User name |
| phone | VARCHAR(20) | Optional |
| created_at | TIMESTAMP | Auto set |

### Table: `user_requirements`

| Column | Type | Notes |
|--------|------|-------|
| id | INT AUTO_INCREMENT | Primary key |
| user_id | INT FK | Links to users.id |
| role | VARCHAR(50) | Owner/Manager/Staff |
| property_type | VARCHAR(100) | Hotel type |
| reason_interest | TEXT | Why they want it |
| biggest_challenge | TEXT | Main problem |
| created_at | TIMESTAMP | Auto set |

### SQL Setup

```sql
CREATE DATABASE stayos_demo;
USE stayos_demo;
-- Gaurav creates tables using migration script
```

---

## 5. API Contract (GAURAV BUILDS THESE EXACTLY)

> ⚠️ Tanushree will call these. Build exactly as specified.

### API 1: Register

| Field | Value |
|-------|-------|
| Method & Route | `POST /api/auth/register` |
| Auth | None (public) |
| Body | `{ email, password, name, phone }` |
| 200 OK | `{ userId, email, msg: 'Created' }` |
| 400 Error | `{ error: 'Email exists' }` |
| Validate | Email, password 8+ chars |

### API 2: Login

| Field | Value |
|-------|-------|
| Method & Route | `POST /api/auth/login` |
| Auth | None (public) |
| Body | `{ email, password }` |
| 200 OK | `{ token: JWT, userId, email }` |
| 401 Error | `{ error: 'Invalid' }` |
| Note | Return JWT token |

### API 3: Submit Questionnaire

| Field | Value |
|-------|-------|
| Method & Route | `POST /api/users/interest` |
| Auth | JWT (`Authorization: Bearer token`) |
| Body | `{ role, propertyType, reason, challenge }` |
| 201 OK | `{ id, msg: 'Saved' }` |
| 401 Error | `{ error: 'Unauthorized' }` |
| Note | Requires login first |

---

## 6. Local Development

### Ports (Fixed)

| Component | URL | Port |
|-----------|-----|------|
| Frontend | http://localhost:3000 | 3000 |
| Backend | http://localhost:5000 | 5000 |
| Database | localhost | 3306 |

### Gaurav's `.env` (backend/)

```env
DATABASE_URL=mysql://root:password@localhost:3306/stayos_demo
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5000
```

### Run Commands

- **Gaurav (Backend):**
  ```bash
  cd backend && npm install && npm start
  ```
- **Tanushree (Frontend):**
  ```bash
  cd frontend && npx http-server -p 3000
  ```

### CORS Setup (Gaurav)

Allow origin `http://localhost:3000`

---

## 7. Security Basics

### Gaurav (Backend) Must Do

- Hash passwords with bcrypt (`npm install bcrypt`)
- Use JWT for login (`npm install jsonwebtoken`)
- Validate all inputs server-side
- Put secrets in `.env` file only
- CORS allow only `http://localhost:3000`
- Never commit `.env` file

### Tanushree (Frontend) Must Do

- Store JWT token in localStorage
- Send JWT in every protected request
- Validate forms before sending
- Show clear error messages
- Clear token on logout

---

## 8. Two-Week Timeline

| Timeline | Tanushree (`feature/frontend`) | Gaurav (`feature/backend`) |
|----------|--------------------------------|----------------------------|
| **W1 D1-2** | Setup index, signup, login HTML; basic form structure | Setup Express, MySQL; create database; create schemas |
| **W1 D3-4** | Add CSS styling; make responsive; client validation | Build register API; build login API; test with Postman |
| **W1 D5** | Questionnaire & confirmation page HTML | Build interest API; setup JWT; setup CORS |
| **W2 D6-7** | Integrate all 3 APIs; test with Gaurav's backend | Test all endpoints; password hashing; error handling |
| **W2 D8-10** | End-to-end testing; fix bugs; polish UI | Database backup; security check; prepare deploy |
| **W2 D11-14** | Deploy frontend (Vercel) | Deploy backend (Railway); live testing |

---

## 9. Definition of Done

### Tanushree's Checklist

- [ ] 5 HTML pages completed
- [ ] CSS styling looks good
- [ ] Forms validate on client side
- [ ] Calls all 3 APIs correctly
- [ ] JWT token stored after login
- [ ] Confirmation page shows after form
- [ ] Mobile responsive
- [ ] `feature/frontend` merged to `develop`

### Gaurav's Checklist

- [ ] Node.js + Express running
- [ ] MySQL tables created
- [ ] `POST /api/auth/register` working
- [ ] `POST /api/auth/login` returns JWT
- [ ] `POST /api/users/interest` saves data
- [ ] CORS configured
- [ ] Error handling on all endpoints
- [ ] `feature/backend` merged to `develop`

### Integration Checklist

- [ ] Complete signup flow works
- [ ] Complete questionnaire flow works
- [ ] Data stored in database
- [ ] Both can work independently
- [ ] `develop` merged to `main`
- [ ] Ready for deployment