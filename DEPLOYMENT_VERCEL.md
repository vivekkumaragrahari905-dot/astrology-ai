# Vercel Deployment Guide

This project has been fully configured for deployment on Vercel via GitHub. Since this repository contains both a Vite React frontend and a FastAPI Python backend, the recommended approach is to deploy them as **two separate projects** on Vercel for optimal performance and easier management.

## 🚀 Step 1: Push to GitHub
1. Commit all your changes and push the project to your GitHub repository.
2. The root `.gitignore` is already configured to exclude unnecessary files like `node_modules`, `venv`, and `__pycache__`.

---

## 🚀 Step 2: Deploy the Backend (FastAPI)
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. In the project configuration:
   - **Project Name:** `swastik-ai-backend` (or similar)
   - **Root Directory:** Click `Edit` and select `backend`
   - **Framework Preset:** `Other`
   - **Build Command:** Leave empty (Vercel will use the `vercel.json` we created in the backend folder)
   - **Install Command:** Leave empty
4. Click **Deploy**.
5. Once deployed, copy the assigned domain url (e.g., `https://swastik-ai-backend.vercel.app`).

---

## 🚀 Step 3: Deploy the Frontend (Vite)
1. Go back to the Vercel dashboard and click **Add New Project**.
2. Import the **exact same** GitHub repository again.
3. In the project configuration:
   - **Project Name:** `swastik-ai-frontend` (or similar)
   - **Root Directory:** Click `Edit` and select `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
4. Expand the **Environment Variables** section and add:
   - **Name:** `VITE_API_URL`
   - **Value:** Paste the backend URL you copied from Step 2 (e.g., `https://swastik-ai-backend.vercel.app`)
5. Click **Deploy**.

## What we fixed for deployment:
1. **Separated Configurations:** Created dedicated `vercel.json` files in both the `frontend` and `backend` directories.
2. **Backend Optimization:** Consolidated the backend files (models, schemas, db) into `main.py` so it works seamlessly as a Vercel Serverless Python function.
3. **Smart Fallback AI:** The backend now has a built-in smart AI fallback. If you don't connect a vLLM server, it will still generate highly contextual Vedic readings based on user input.
4. **API Integration:** Updated `App.jsx` to correctly call the `/api/chat` endpoint instead of using hardcoded mock responses.
5. **GitIgnore:** Added a comprehensive `.gitignore` to ensure clean commits.
