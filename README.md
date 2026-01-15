# Yumzy - Food Discovery App

A full-stack food discovery application with a TikTok/Instagram Reels-like interface for exploring food content and discovering local restaurants.

## 🚀 Tech Stack

### Frontend

- **React** 19.2.0 - UI Library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **CSS** - Custom styling with theme support

### Backend

- **Node.js** with **Express** 5.2.1 - Server framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **ImageKit** - Image/video hosting
- **Multer** - File upload handling

## 📁 Project Structure

```
yumzy/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components (VideoCard, VideoFeed, etc.)
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Authentication pages
│   │   │   ├── general/   # General pages (Home)
│   │   │   └── food-partner/  # Food partner pages
│   │   ├── routes/        # Route configuration
│   │   └── styles/        # CSS stylesheets
│   └── package.json
├── backend/           # Express backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Custom middleware
│   │   ├── services/      # Business logic
│   │   └── db/            # Database configuration
│   ├── server.js
│   └── package.json
└── vedios/           # Video assets

```

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- ImageKit account (for media hosting)

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from template:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

   - `JWT_SECRET`: Your secret key for JWT tokens
   - `MONGO_URI`: MongoDB connection string
   - `PORT`: Server port (default: 3000)
   - `IMAGEKIT_PUBLIC_KEY`: Get from ImageKit dashboard
   - `IMAGEKIT_PRIVATE_KEY`: Get from ImageKit dashboard
   - `IMAGEKIT_URL_ENDPOINT`: Your ImageKit endpoint URL

5. Start the development server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from template (optional):

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Authentication Flow

The application supports two types of users:

### Regular Users

- **Registration**: `/user/register`
- **Login**: `/user/login`
- **Home Feed**: `/` (redirects to login if not authenticated)

### Food Partners (Restaurant Owners)

- **Registration**: `/foodpartner/register`
- **Login**: `/foodpartner/login`
- **Dashboard**: `/foodpartner/dashboard`
- **Create Food Post**: `/create-food`

### Entry Points

1. **Root (`/`)**: Shows video feed for authenticated users, redirects to login otherwise
2. **Choose Registration (`/register`)**: Allows selection between user and food partner registration
3. **Store Profile (`/store/:id`)**: View food partner's profile and content

## 🎯 Key Features

- **Reels-Style Video Feed**: Vertical scrolling video interface
- **User Authentication**: Separate flows for users and food partners
- **Food Partner Dashboard**: Manage restaurant profile and content
- **Store Profiles**: Dedicated pages for each food partner
- **Comments System**: Interactive comments on food posts
- **Video Upload**: Support for video content with ImageKit integration

## 🛠️ Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔒 Security Notes

- Never commit `.env` files to version control
- Keep your `JWT_SECRET` secure and random
- Use HTTPS in production
- Validate and sanitize all user inputs
- Keep dependencies updated

## 📝 License

ISC

## 👥 Contributing

This is a private project. For questions or contributions, please contact the project maintainer.
