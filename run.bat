@echo off
start cmd /k "color 0A && title FastAPI Backend && .\venv\Scripts\activate && uvicorn app.main:app --reload"
start cmd /k "color 0B && title Vite Frontend && cd frontend && npm run dev"