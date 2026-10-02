# EstatePulse Deployment Guide

This project can be deployed as a full-stack application with:
- Frontend (React/Vite): Deployed on [Vercel](https://vercel.com/)
- Backend API (Express): Deployed on [Render](https://render.com/)

---

## 1. Deploy Backend API to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `estatepulse-api`
   - Environment: `Node`
   - Region: Choose your preferred region
   - Branch: `main` (or your default branch)
   - Build Command: `npm install`
   - Start Command: `npm start`

5. Add Environment Variables (required):
   | Variable | Value | Notes |
   |---|---|---|
   | `PORT` | `5000` | Render will override, but safe to set |
   | `JWT_SECRET` | (generate a strong random string) | Used for auth tokens - keep secret! |
   | `ADMIN_EMAIL` | `admin@estatepulse.b2b` | Admin login email |
   | `ADMIN_PASSWORD` | (strong password) | Admin login password - keep secret! |

6. Click "Create Web Service"
7. Once deployed, copy your Render URL (e.g., `https://estatepulse-api.onrender.com`)

---

## 2. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: `Vite`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

5. Add Environment Variable (required):
   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://estatepulse-api.onrender.com/api` |

   Replace with your actual Render API URL from step 1 above.

6. Click "Deploy"

---

## 3. Notes & Important Considerations

### Data Persistence
The backend currently uses file-based JSON storage (`server/data/*.json`). On Render (free tier), the filesystem is ephemeral - any uploaded files/data written during runtime will be lost when the service restarts/sleeps.

**For production use**, consider migrating to a persistent database like:
- [Supabase](https://supabase.com/) (Postgres, free tier)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (NoSQL, free tier)
- [PlanetScale](https://planetscale.com/) (MySQL)
- [Neon](https://neon.tech/) (Postgres)

### Cold Starts (Free Tier)
Render free tier services may sleep after 15 minutes of inactivity. First request after sleep will take a few seconds to spin up - this is normal.

### CORS
CORS is currently configured to allow all origins (`*`). For production, you may want to restrict it to your Vercel domain for better security.

### Security
- Generate strong, unique values for `JWT_SECRET` and `ADMIN_PASSWORD`
- Never commit `.env` files to git (already in `.gitignore`)
- The `.env.production.example` file shows what variables you need

---

## Quick Test

1. After backend deploy, visit `https://your-render-url/api` - you should see a JSON health check response
2. After frontend deploy, visit your Vercel URL - app should load and be able to connect to the API

