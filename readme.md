# Dukan - Photography Marketplace Platform

> 🚧 **Work in Progress** - This project is actively under development

A full-stack marketplace application connecting photographers with clients. Users can discover, book, and review photographers for their events and creative needs.

## 📱 Preview

**Dukan** allows photographers to create profiles, showcase portfolios, manage bookings, and build their reputation through client reviews.

## 🏗️ Project Structure

```
├── backend/          # Express.js + TypeScript API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middlewares/    # Express middleware
│   │   ├── validations/    # Zod schemas
│   │   ├── utils/          # Helper functions
│   │   └── app.ts          # Entry point
│   └── package.json
│
└── frontend/        # Next.js 14+ Application
    ├── src/
    │   ├── app/            # App Router pages
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts
    │   └── lib/            # Utilities
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT (Access + Refresh tokens)
- **Validation**: Zod
- **Uploads**: Multer + Cloudinary

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules / Tailwind
- **HTTP**: Axios

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd dukan
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
cp .env.example .env
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and the API at `http://localhost:3001`.

## 📝 Environment Variables

### Backend (.env)
```
PORT=3001
ORIGIN_HOSTS=http://localhost:5173

# JWT Secrets (generate secure random strings)
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=6h
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Database
MONGO_URI=mongodb://localhost:27017
DB_NAME=dukan
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## 🔌 API Endpoints

| Resource | Description |
|----------|-------------|
| `/api/v1/users` | Authentication & user management |
| `/api/v1/photographers` | Photographer profiles |
| `/api/v1/portfolio` | Portfolio management |
| `/api/v1/bookings` | Booking system |
| `/api/v1/reviews` | Reviews & ratings |

## 📌 Status

- ✅ Database schema
- ✅ Express server setup
- ✅ JWT authentication
- ✅ Photographer profiles
- ✅ Portfolio uploads (Cloudinary)
- ✅ Booking system
- ✅ Reviews
- 🔄 Frontend development
- 🔄 Search & filtering
- 🔄 Payment integration (planned)
- 🔄 Real-time notifications (planned)

## 📄 License

ISC

---

*Built with ❤️ for photographers and their clients*
