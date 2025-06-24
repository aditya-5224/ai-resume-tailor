@echo off
echo Starting AI Resume Tailor with Docker...
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
    echo NODE_ENV=production >> backend\.env
    echo PORT=5000 >> backend\.env
)

if not exist "frontend\.env" (
    echo Warning: frontend\.env file not found. Creating template...
    echo VITE_API_URL=http://localhost:5000 > frontend\.env
)

echo Building and starting containers...
docker-compose up --build -d

if errorlevel 0 (
    echo.
    echo ✅ AI Resume Tailor is now running!
    echo.
    echo 🌐 Frontend: http://localhost:3000
    echo 🔧 Backend API: http://localhost:5000
    echo.
    echo To stop the application, run: stop-docker.bat
    echo To view logs, run: docker-compose logs -f
    echo.
    echo Opening application in browser...
    timeout /t 3 >nul
    start http://localhost:3000
) else (
    echo ❌ Failed to start containers. Check the logs with: docker-compose logs
)

pause
