# Children's Literacy Learning Platform Backend

A production-ready Spring Boot backend for a children's literacy learning platform inspired by Duolingo ABC.

The system supports parent onboarding, child profile management, curriculum units, lessons, exercises, progress tracking, XP, streaks, badges, notifications, leaderboard, admin activity logs, and platform statistics.

## Tech Stack

- Java 21+
- Spring Boot
- Spring Security
- JWT Authentication
- BCrypt password hashing
- Spring Data JPA 
- PostgreSQL
- H2 for local/test profile
- Flyway database migrations
- Swagger 
- Postman
- Docker / Docker Compose
- GitHub Actions CI

## Main Features

### Authentication and Authorization

- Parent registration
- Login with JWT access token and refresh token
- Logout / refresh token invalidation
- BCrypt password hashing
- Role-based access control:
  - PARENT
  - ADMIN
  - CHILD

### Child Profile Management

Parents can create and manage child profiles.

Each child profile stores:

- name
- age
- avatar
- starting level
- current level
- XP
- daily streak
- progress percentage

### Curriculum Management

Admins can manage:

- Units
- Lessons
- Exercises

Curriculum hierarchy:

```text
Unit → Lesson → Exercise
