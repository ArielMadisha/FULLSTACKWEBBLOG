# FullStackWebBlog

Developer-focused full-stack blogging site.

## Tech stack (per spec)
- Frontend: React (Vite) + plain CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT
- Image uploads: Multer + Cloudinary

## Folder structure
- `backend/` Express API
- `frontend/` React app

## API endpoints
### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Posts
- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts` (JWT required, `multipart/form-data`)
- `PUT /api/posts/:id` (JWT required, `multipart/form-data`)
- `DELETE /api/posts/:id` (JWT required)

## Local setup
### 1) Backend
1. Copy env template:
   - Duplicate `backend/.env.example` → `backend/.env`
2. Fill in:
   - `MONGO_URI` (local MongoDB or MongoDB Atlas)
   - `JWT_SECRET`
   - Cloudinary vars if you want image uploads to work

Run:
- `cd backend`
- If PowerShell blocks `npm` scripts, use `npm.cmd`.
- `npm.cmd run dev`

Backend runs on `http://localhost:5000`.

### 2) Frontend
1. Copy env template:
   - Duplicate `frontend/.env.example` → `frontend/.env`
2. Run:
   - `cd frontend`
   - `npm.cmd run dev`

Frontend runs on `http://localhost:5173`.

## Notes
- JWT logout is client-side (token removal). The `/api/auth/logout` endpoint returns a success response for completeness.
- If Cloudinary is not configured, creating/editing posts *without* an image works, but uploading an image returns an error.

## Postman testing
Import these into Postman:
- Collection: [postman/FullStackWebBlog.postman_collection.json](postman/FullStackWebBlog.postman_collection.json)
- Environment: [postman/FullStackWebBlog.local.postman_environment.json](postman/FullStackWebBlog.local.postman_environment.json)

Flow:
- Run **Auth → Signup** (or **Login**) to auto-save `token` in the environment.
- Run **Posts → Create post** to auto-save `postId`.
- Run **Get single / Update / Delete** using that `postId`.

## Deployment

### Backend (Render)
This repo includes a Render Blueprint at [render.yaml](render.yaml).

1. Push this repo to GitHub.
2. In Render:
   - New → **Blueprint** → connect your repo → apply.
3. In the created `fullstackwebblog-api` service, set Environment Variables:
   - `MONGO_URI` (MongoDB Atlas connection string recommended)
   - `JWT_SECRET` (long random string)
   - Optional for image uploads:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
4. Deploy and confirm:
   - `https://fullstackwebblog-2hmx.onrender.com/health` returns `{ ok: true }`

After your frontend is deployed, update CORS allowlist:
- Set `CLIENT_ORIGIN` to a comma-separated list, for example:
  - `http://localhost:5173,https://your-frontend.vercel.app`

### Frontend (Vercel)
1. In Vercel:
   - New Project → import the GitHub repo.
   - **Root Directory**: set to `frontend`.
2. Set Environment Variables:
   - `VITE_API_URL` = your Render backend URL, e.g. `https://<your-render-service>.onrender.com`
3. Build settings (usually auto-detected):
   - Build Command: `npm run build`
   - Output Directory: `dist`

Finally, go back to Render and add your Vercel URL to `CLIENT_ORIGIN`.
