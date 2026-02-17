# Deployment Guide - Yumzy App

This guide covers deploying both frontend and backend of the Yumzy application.

## Prerequisites

- GitHub account (recommended for continuous deployment)
- MongoDB Atlas account (for cloud database) OR MongoDB local instance
- ImageKit account with credentials

## Backend Deployment

### Option 1: Railway (Recommended)

Railway provides easy deployment with automatic MongoDB and environment variable management.

1. **Prepare Your Backend**:

   - Ensure your `package.json` has correct start script: `"start": "node server.js"`
   - Make sure all dependencies are in `package.json`

2. **Deploy to Railway**:

   - Go to [railway.app](https://railway.app/)
   - Click "Start a New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Select the backend folder as root directory

3. **Configure Environment Variables**:

   - In Railway dashboard, go to Variables
   - Add each variable from your `.env.example`:
     ```
     JWT_SECRET=<generate-a-secure-random-string>
     MONGO_URI=<your-mongodb-atlas-connection-string>
     PORT=3000
     IMAGEKIT_PUBLIC_KEY=<your-imagekit-public-key>
     IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
     IMAGEKIT_URL_ENDPOINT=<your-imagekit-endpoint>
     ```

4. **Deploy**:
   - Railway will automatically deploy
   - Note your deployment URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

This repo includes a Render Blueprint at `render.yaml`. Update the placeholder values (or set env vars in the Render dashboard) before deploying.

1. **Create New Web Service**:

   - Go to [render.com](https://render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**:

   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Add Environment Variables**:

   - Add all variables from `.env.example`
   - Use MongoDB Atlas for database

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 3: Heroku

1. **Install Heroku CLI** and login:

   ```bash
   heroku login
   ```

2. **Create Heroku App**:

   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**:

   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set IMAGEKIT_PUBLIC_KEY=your_key
   heroku config:set IMAGEKIT_PRIVATE_KEY=your_key
   heroku config:set IMAGEKIT_URL_ENDPOINT=your_endpoint
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

## Frontend Deployment

### Option 1: Netlify (Recommended)

1. **Prepare Frontend**:

   - Build locally to test:
     ```bash
     cd frontend
     npm run build
     ```

2. **Deploy to Netlify**:

   - Go to [netlify.com](https://netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`

3. **Environment Variables**:

   - In Netlify dashboard: Site Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```

4. **Deploy**:
   - Netlify will automatically build and deploy
   - Get your site URL (e.g., `https://your-app.netlify.app`)

### Option 2: Vercel

1. **Deploy to Vercel**:

   - Go to [vercel.com](https://vercel.com/)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**:

   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**:

   - Add `VITE_API_URL` with your backend URL

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Option 3: GitHub Pages (Static Only)

1. **Update vite.config.js**:

   ```javascript
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     base: "/your-repo-name/",
   });
   ```

2. **Build**:

   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

## MongoDB Setup (If using MongoDB Atlas)

1. **Create Cluster**:

   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster

2. **Create Database User**:

   - Database Access → Add New Database User
   - Set username and password

3. **Whitelist IP**:

   - Network Access → Add IP Address
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for ease

4. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your database user password
   - Use this as `MONGO_URI` in backend environment variables

## Post-Deployment Checklist

### Backend

- [ ] All environment variables are set correctly
- [ ] Database connection is working
- [ ] API endpoints are accessible
- [ ] CORS is configured to allow frontend domain

### Frontend

- [ ] `VITE_API_URL` points to deployed backend
- [ ] Build completes without errors
- [ ] All routes are working
- [ ] Authentication flow works
- [ ] Images/videos load from ImageKit

## Updating Backend CORS

After deploying frontend, update backend to allow your frontend domain:

In `backend/src/app.js`, update CORS configuration:

```javascript
const corsOptions = {
  origin: [
    "http://localhost:5173", // Development
    "https://your-app.netlify.app", // Production
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

## Continuous Deployment

Both Netlify/Vercel and Railway/Render support automatic deployments:

1. Push to your main branch on GitHub
2. Services will automatically detect and deploy changes
3. Monitor build logs for any errors

## Troubleshooting

### Backend Issues

- **Database connection fails**: Check MongoDB URI and network access
- **Environment variables missing**: Verify all vars from `.env.example` are set
- **Port errors**: Ensure PORT is set correctly (Railway and Render handle this automatically)

### Frontend Issues

- **Blank page**: Check browser console for errors, verify `VITE_API_URL`
- **API calls fail**: Check CORS configuration on backend
- **Build fails**: Check for ESLint errors, run `npm run lint` locally

### CORS Errors

- Ensure backend CORS allows your frontend domain
- Check that `credentials: true` is set in CORS options
- Verify `withCredentials: true` in axios requests

## Security Notes

- Never commit `.env` files
- Use strong, random JWT_SECRET (at least 32 characters)
- Enable HTTPS (automatic on Netlify/Vercel/Railway/Render)
- Keep MongoDB Atlas IP whitelist restrictive if possible
- Regularly rotate ImageKit API keys
- Keep dependencies updated with `npm audit`

## Support

For deployment issues:

- Railway: [docs.railway.app](https://docs.railway.app/)
- Netlify: [docs.netlify.com](https://docs.netlify.com/)
- Render: [render.com/docs](https://render.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com/)
