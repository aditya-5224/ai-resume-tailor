@echo off
echo Cleaning up AI Resume Tailor Docker resources...
echo.

REM Stop containers
docker-compose down
docker-compose -f docker-compose.dev.yml down

REM Remove containers
echo Removing containers...
docker container rm ai-resume-tailor-backend ai-resume-tailor-frontend ai-resume-tailor-backend-dev ai-resume-tailor-frontend-dev 2>nul

REM Remove images
echo Removing images...
docker image rm ai-resume-tailor-backend ai-resume-tailor-frontend 2>nul
docker image rm ai-resume-tailor-backend-dev ai-resume-tailor-frontend-dev 2>nul

REM Remove networks
echo Removing networks...
docker network rm ai-resume-network ai-resume-network-dev 2>nul

REM Remove volumes
echo Removing volumes...
docker volume rm ai-resume-backend-modules ai-resume-frontend-modules 2>nul

REM Clean up unused resources
echo Cleaning up unused Docker resources...
docker system prune -f

echo.
echo ✅ Docker cleanup completed!
echo.
echo To rebuild and start fresh, run: run-docker.bat
pause
