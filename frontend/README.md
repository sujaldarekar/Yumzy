# Yumzy Frontend

React frontend for the Yumzy food discovery application.

## Tech Stack

- React 19.2.0
- Vite 7.2.4
- React Router DOM 7.11.0
- Axios 1.13.2

## Development

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── VideoCard.jsx
│   ├── VideoFeed.jsx
│   └── CommentsModal.jsx
├── pages/           # Page components
│   ├── auth/        # Authentication pages
│   ├── general/     # Home and general pages
│   └── food-partner/  # Food partner pages
├── routes/          # Route configuration
│   └── AppRoutes.jsx
├── styles/          # CSS files
│   ├── theme.css    # Theme variables
│   ├── auth.css     # Auth page styles
│   ├── Reels.css    # Video feed styles
│   ├── Store.css    # Store profile styles
│   └── App.css      # Global styles
└── App.jsx          # Root component
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:3000
```

For production, set this to your deployed backend URL.

## Routes

- `/` - Home feed (requires authentication)
- `/register` - Choose registration type
- `/user/login` - User login
- `/user/register` - User registration
- `/foodpartner/login` - Food partner login
- `/foodpartner/register` - Food partner registration
- `/foodpartner/dashboard` - Food partner dashboard
- `/store/:id` - Store profile page
- `/create-food` - Create food post

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

See the root [README.md](../README.md) for full project documentation.
