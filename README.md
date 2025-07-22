# NestAUTH
Starter Template for custom implemented authentication and authorization in NESTjs

---

## Project Overview

**NestAUTH** is a starter template for custom authentication and authorization in NestJS, using Prisma ORM and JWT-based access/refresh tokens. It supports user roles and secure route protection.

### Features

- **User Authentication**: Sign up and login with hashed passwords.
- **JWT Access & Refresh Tokens**: Secure token-based authentication with HTTP-only cookies.
- **Role-based Authorization**: Supports `USER`, `ADMIN`, and `MODERATOR` roles.
- **Guards & Decorators**: Custom NestJS guards and decorators for route protection and user extraction.
- **Prisma ORM**: PostgreSQL database integration via Prisma.
- **Modular Structure**: Organized modules for Auth, Users, Roles, and Prisma.

### Main Modules

- `auth/`: Handles authentication logic, DTOs, and controllers.
- `users/`: User management, including listing and deleting users (admin only).
- `roles/`: Role enums, decorators, and guards for authorization.
- `common/`: Shared guards and decorators.
- `prisma/`: Prisma service and module for database access.
- `config/`: Centralized configuration using environment variables.

### Database Schema

- `User` model with fields: `id`, `fullName`, `email`, `password`, `role`, `refreshToken`, `createdAt`, `updatedAt`.
- `Role` enum: `USER`, `ADMIN`, `MODERATOR`.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/masabinhok/nest-auth.git
   cd nest-auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
   JWT_ACCESS_SECRET="your_access_secret_key"
   JWT_REFRESH_SECRET="your_refresh_secret_key"
   JWT_ACCESS_EXPIRE="15m"
   JWT_REFRESH_EXPIRE="7d"
   FRONTEND_URL="http://localhost:3000"
   PORT=5000
   ```

4. **Set up the database**
   
   Run Prisma migrations to set up your database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

### Running the Application

- **Development mode**:
  ```bash
  npm run start:dev
  ```

- **Production build**:
  ```bash
  npm run build
  npm run start:prod
  ```

- **Run tests**:
  ```bash
  npm run test
  npm run test:e2e
  ```

The server will start on `http://localhost:5000` (or your configured PORT).

### Database Management

- **View your data**: Open Prisma Studio
  ```bash
  npx prisma studio
  ```

- **Reset database**:
  ```bash
  npx prisma migrate reset
  ```

### API Endpoints

#### Authentication
- **Sign Up**: `POST /auth/signup`
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Login**: `POST /auth/login`
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Refresh Token**: `POST /auth/refresh`
- **Logout**: `POST /auth/logout`

#### Users (Protected Routes)
- **Get All Users**: `GET /users`
- **Delete User** (Admin Only): `DELETE /users/:id`

### Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dtos/            # Data transfer objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/               # Users module
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── roles/               # Role-based authorization
│   ├── roles.decorator.ts
│   ├── roles.enum.ts
│   └── roles.guard.ts
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators
│   └── guards/          # Authentication guards
├── prisma/              # Database module
│   ├── prisma.service.ts
│   └── prisma.module.ts
└── config/              # Configuration
    └── config.ts
```

### Key Features Explained

#### Role-based Access Control
- The first user to register automatically becomes an `ADMIN`
- Subsequent users are assigned the `USER` role by default
- Use the `@Roles()` decorator with `@UseGuards(AuthGuard, RolesGuard)` to protect routes

#### JWT Authentication
- Access tokens (15 minutes) and refresh tokens (7 days) are stored as HTTP-only cookies
- Automatic token refresh mechanism implemented
- Secure cookie configuration for production use

#### Security Features
- Password hashing with bcrypt
- HTTP-only cookies to prevent XSS attacks
- CORS configuration for frontend integration
- Input validation using class-validator

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
