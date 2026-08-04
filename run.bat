@echo off
echo ===========================================
echo   Starting Swastik AI Development Server
echo ===========================================

echo [1/3] Opening VS Code...
code .

echo [2/3] Starting FastAPI Backend (in a new window)...
start cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload"

echo [3/3] Starting Vite Frontend...
cd frontend
npm run dev
