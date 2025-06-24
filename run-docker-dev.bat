@echo off
echo Starting AI Resume Tailor in Development Mode...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if .env files exist
if not exist "backend\.env" (
    echo Warning: backend\.env file not found. Creating template...
    echo GEMINI_API_KEY=your_gemini_api_key_here > backend\.env
    echo NODE_ENV=development >> backend\.env
    echo PORT=5000 >> backend\.env
)

if not exist "frontend\.env" (
    echo Warning: frontend\.env file not found. Creating template...
    echo VITE_API_URL=http://localhost:5000 > frontend\.env
)

echo Building and starting development containers...
docker-compose -f docker-compose.dev.yml up --build

echo.
echo ✅ Development environment stopped.
pause
