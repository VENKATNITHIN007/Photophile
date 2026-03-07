# Photophile

<p align="center">
  <strong>A marketplace connecting photographers with clients</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15">
  <img src="https://img.shields.io/badge/Express.js-4.x-404040?style=flat-square&logo=express" alt="Express.js">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License">
</p>

<p align="center">
  <em>Codename: Dukan</em>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Commands](#commands)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

Photophile is a full-stack marketplace application that connects photographers with clients. Photographers can create professional profiles, showcase their portfolios, manage bookings, and build their reputation through client reviews. Clients can discover photographers, view their work, book services, and leave reviews.

### Key Highlights

- **Secure Authentication**: JWT with HTTP-only cookies and refresh token rotation
- **Image Management**: Cloudinary integration for uploads and transformations
- **Search & Discovery**: Filter photographers by location, specialty, and availability
- **Booking System**: Complete workflow from inquiry to confirmation
- **Review System**: Ratings and feedback to build trust

---

## Features

### Implemented

- [x] JWT Authentication with access and refresh tokens
- [x] Photographer profiles with portfolio management
- [x] Booking system with status tracking
- [x] Reviews and ratings system
- [x] Image uploads via Cloudinary
- [x] Search and filtering capabilities
- [x] Zod validation for all inputs
- [x] Rate limiting for API protection
- [x] Security headers middleware

### Planned

- [ ] Payment integration (Stripe)
- [ ] Real-time notifications (WebSockets)
- [ ] Email notifications
- [ ] Advanced search with geolocation
- [ ] Photographer availability calendar

---

## Architecture

Photophile follows a clean separation between frontend and backend:

```
┌─────────────────┐         ┌─────────────────┐
│   Next.js 15    │         │  Express.js API │
│   (Frontend)    │◄───────►│   (Backend)     │
│   Port: 3000    │  HTTP   │   Port: 3001    │
└─────────────────┘         └────────┬────────┘
                                     │
                              ┌──────┴──────┐
                              │   MongoDB   │
                              └─────────────┘
```

### Design Decisions

- **Separate Codebases**: Frontend and backend can be deployed independently
- **API Versioning**: All routes prefixed with `/api/v1/` for backward compatibility
- **HTTP-Only Cookies**: JWT tokens stored in cookies to prevent XSS attacks
- **Dual Token Strategy**: Short-lived access tokens (6h) with long-lived refresh tokens (10d)

See [docs/decisions.md](docs/decisions.md) for detailed architectural decisions.

---

## Project Structure

```
├── backend/                # Express.js API
│   └── src/
│       ├── app.ts          # Entry point
│       ├── config.ts       # Environment config
│       ├── constants.ts    # App constants
│       ├── controllers/    # Route handlers
│       ├── db/             # Database connection
│       ├── middlewares/    # Express middleware
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API routes
│       ├── types/          # TypeScript types
│       ├── utils/          # Helpers
│       └── validations/    # Zod schemas
│
└── frontend/               # Next.js 15 App
    └── src/
        ├── app/            # App Router pages
        ├── components/     # React components
        │   ├── forms/      # Form components
        │   ├── gallery/    # Gallery components
        │   ├── layout/     # Layout components
        │   ├── photographer/ # Photographer components
        │   ├── search/     # Search components
        │   ├── filters/    # Filter components
        │   └── ui/         # shadcn/ui components
        ├── contexts/       # React contexts (auth)
        ├── hooks/          # Custom React hooks
        ├── lib/            # Utilities
        │   └── validations/ # Frontend Zod schemas
        ├── styles/         # CSS styles
        └── middleware.ts   # Next.js middleware
```

---

## Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| TypeScript | Type safety |
| MongoDB | Document database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| Zod | Runtime validation |
| Multer | File upload handling |
| Cloudinary | Image storage and CDN |
| bcrypt | Password hashing |

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | UI component library |
| Axios | HTTP client |
| React Context | State management |

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB (local instance or Atlas cluster)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd Photophile
```

2. **Setup Backend**

```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

3. **Setup Frontend**

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your API URL
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and the API at `http://localhost:3001`.

---

## Environment Variables

### Backend (.env)

```env
PORT=3001
ORIGIN_HOSTS=http://localhost:3000
APP_DEBUG=false

# JWT Secrets (generate secure random strings)
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=6h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=photophile
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ACCESS_TOKEN_SECRET=your-access-token-secret
```

---

## Commands

### Backend

```bash
cd backend/

npm install           # Install dependencies
npm run dev           # Start development server (nodemon + ts-node on port 3001)
npm run build         # Compile TypeScript to dist/
npm start             # Run compiled app (node dist/index.js)
```

### Frontend

```bash
cd frontend/

npm install           # Install dependencies
npm run dev           # Start Next.js dev server with Turbopack (port 3000)
npm run build         # Build for production
npm start             # Start production server
```

---

## API Documentation

Base URL: `http://localhost:3001/api/v1`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Create new account |
| POST | `/users/login` | Authenticate user |
| POST | `/users/logout` | Logout user |
| POST | `/users/refresh-token` | Refresh access token |
| GET | `/users/me` | Get current user |

### Photographers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/photographers` | List all photographers |
| GET | `/photographers/:id` | Get photographer profile |
| POST | `/photographers` | Create photographer profile |
| PATCH | `/photographers/:id` | Update profile |

### Portfolio

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolio/:photographerId` | Get portfolio items |
| POST | `/portfolio` | Upload new image |
| DELETE | `/portfolio/:id` | Delete image |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | List user bookings |
| POST | `/bookings` | Create booking |
| PATCH | `/bookings/:id` | Update booking status |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews/:photographerId` | Get reviews |
| POST | `/reviews` | Create review |

---

## Screenshots

*Screenshots will be added here once the frontend is complete.*

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Run type checking before committing
- Write meaningful commit messages

---

## Troubleshooting

### Common Issues

**CORS errors in browser**
- Verify `ORIGIN_HOSTS` in backend `.env` includes your frontend URL
- Ensure `credentials: true` is set in both frontend and backend

**JWT verification fails**
- Check that `ACCESS_TOKEN_SECRET` matches in both `.env` files
- Verify cookies are being sent (check browser DevTools)

**MongoDB connection fails**
- Confirm MongoDB is running locally or Atlas connection string is correct
- Check network access settings in Atlas

**Image uploads fail**
- Verify Cloudinary credentials in backend `.env`
- Check file size limits (Multer default is usually sufficient)

### Getting Help

- Check [docs/decisions.md](docs/decisions.md) for architectural context
- Review [docs/patterns.md](docs/patterns.md) for coding patterns
- Open an issue with detailed reproduction steps

---

## License

ISC

---

<p align="center">
  Built for photographers and their clients
</p>
