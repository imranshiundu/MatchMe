@echo off
setlocal enabledelayedexpansion

:: MatchMe Installation & Setup Script (Windows)
:: This script prepares the environment, starts the database, and launches the application.

echo ==================================================
echo       MatchMe Social Platform - Setup Wizard
echo ==================================================

:: 1. Check Dependencies
echo.
echo [1/5] Checking Dependencies...

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH.
    pause
    exit /b 1
)

where java >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Java is not installed or not in PATH.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH.
    pause
    exit /b 1
)

:: 2. Setup Environment
echo.
echo [2/5] Setting up Environment...
if not exist "backend\.env" (
    echo Creating default backend\.env file...
    (
    echo DB_URL=jdbc:postgresql://127.0.0.1:5433/matchme
    echo DB_USERNAME=postgres
    echo DB_PASSWORD=postgres
    echo CLOUDINARY_CLOUD_NAME=your_cloud_name
    echo CLOUDINARY_API_KEY=your_api_key
    echo CLOUDINARY_API_SECRET=your_api_secret
    echo JWT_SECRET=super_secret_jwt_key_that_is_long_enough_for_hs256
    echo JWT_EXPIRATION=86400000
    echo FRONTEND_URL=http://localhost:5173
    ) > backend\.env
    echo Environment file created.
) else (
    echo Backend .env already exists.
)

:: 3. Start Database
echo.
echo [3/5] Starting PostgreSQL (Docker)...
docker compose up -d
echo Database is running on port 5433.

:: 4. Build and Start Backend
echo.
echo [4/5] Building and Starting Backend...
cd backend
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo Backend build failed.
    pause
    exit /b 1
)

echo Launching Backend in background...
start /b java -jar target/backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1
echo Backend started. Logs: backend\backend.log
cd ..

:: 5. Start Frontend
echo.
echo [5/5] Installing and Starting Frontend...
cd frontend
call npm install
echo Frontend dependencies installed.

echo --------------------------------------------------
echo Setup Complete!
echo Backend: http://localhost:8085
echo Frontend: http://localhost:5173
echo --------------------------------------------------
echo The dev server is starting now...

npm run dev
