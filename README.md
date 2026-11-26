# Cavite Tourist Spots Information System

A RESTful backend prototype for managing tourist spots in Cavite. The system stores tourist spots, categories, municipalities, users, reviews, and photo links.

## Technology stack

- NestJS and TypeScript
- TypeORM
- MySQL
- JWT authentication
- bcrypt password hashing
- Postman for API testing

## Requirements

- Node.js and npm
- MySQL through XAMPP or another MySQL installation

## Installation

From this `backend` directory, install dependencies:

```bash
npm install
```

Create a MySQL database named `cavite_tourist_spots`, or import the SQL export from the project `database` directory.

## Running the backend

```bash
npm run start:dev
```

The API runs at:

```text
http://localhost:3000/api/v1
```

Other commands:

```bash
npm run build
npm run start:prod
npm test
```

## Authentication

Register:

```text
POST /api/v1/auth/register
```

Login and receive a JWT:

```text
POST /api/v1/auth/login
```

Send the token to protected routes with:

```text
Authorization: Bearer <access_token>
```

## API resources

| Resource | Base URI | Access |
|---|---|---|
| Categories | `/api/v1/categories` | CRUD |
| Municipalities | `/api/v1/municipalities` | CRUD |
| Tourist spots | `/api/v1/tourist-spots` | CRUD |
| Users | `/api/v1/users` | Authenticated CRUD |
| Reviews | `/api/v1/reviews` | Public reads; authenticated writes |
| Photos | `/api/v1/photos` | Public reads; authenticated writes |

CRUD routes use `GET`, `POST`, `PATCH`, and `DELETE`. Validation errors return `400 Bad Request`; missing records return `404 Not Found`; protected routes without a valid token return `401 Unauthorized`.

## Testing with Postman

Import the exported Postman collection from the project `postman` directory. Register or log in first, copy the returned token, and use it as a Bearer Token for protected requests.

## Security notes

- Passwords are hashed with bcrypt before storage.
- Passwords are excluded from API responses.
- Dependencies and build output must not be committed.
