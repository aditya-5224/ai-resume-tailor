@echo off
echo Stopping AI Resume Tailor containers...
echo.

REM Stop and remove containers
docker-compose down

REM Also stop dev containers if running
docker-compose -f docker-compose.dev.yml down

echo.
echo ✅ All containers stopped successfully!
echo.
echo To restart the application, run: run-docker.bat
pause
