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

### Usage

- **Sign Up**: `POST /auth/signup`
- **Login**: `POST /auth/login`
- **List Users**: `GET /users` (protected)
- **Delete User**: `DELETE /users/:id` (admin only)

---
