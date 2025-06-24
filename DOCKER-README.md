# Docker Setup Guide for AI Resume Tailor

This guide will help you run the AI Resume Tailor application using Docker Desktop on Windows.

## Prerequisites

1. **Docker Desktop** - Download and install from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. **Git** (optional) - For cloning the repository
3. **Gemini API Key** - Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Quick Start

### 1. Setup Environment Variables

Create the following environment files:

**Backend Environment (`backend/.env`):**
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
NODE_ENV=production
PORT=5000
```

**Frontend Environment (`frontend/.env`):**
```
VITE_API_URL=http://localhost:5000
```

### 2. Run with Docker

**Production Mode (Recommended):**
```bash
# Double-click run-docker.bat or run in Command Prompt:
run-docker.bat
```

**Development Mode:**
```bash
# Double-click run-docker-dev.bat or run in Command Prompt:
run-docker-dev.bat
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/test

## Docker Commands

### Manual Docker Commands

If you prefer to use Docker commands directly:

**Production:**
```bash
docker-compose up --build -d
```

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Stop containers:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```

**Clean up everything:**
```bash
docker-compose down
docker system prune -f
```

### Batch Scripts

We've provided convenient batch scripts for Windows:

- `run-docker.bat` - Start production environment
- `run-docker-dev.bat` - Start development environment
- `stop-docker.bat` - Stop all containers
- `run-docker-clean.bat` - Clean up all Docker resources

## Container Details

### Backend Container
- **Image**: Node.js 18 Alpine
- **Port**: 5000
- **Health Check**: `/api/test`
- **Environment**: Production optimized with security

### Frontend Container
- **Image**: Nginx Alpine (production) / Node.js 18 Alpine (development)
- **Port**: 3000 (mapped to 80 in production)
- **Build**: Multi-stage build for optimized production
- **Proxy**: API requests forwarded to backend

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Common Issues

1. **Docker not running:**
   ```
   Error: Docker is not running. Please start Docker Desktop first.
   ```
   **Solution**: Start Docker Desktop and wait for it to be ready.

2. **Port already in use:**
   ```
   Error: Port 3000 or 5000 is already in use
   ```
   **Solution**: Stop other applications using these ports or modify the ports in docker-compose.yml.

3. **API Key not working:**
   ```
   Error: GEMINI_API_KEY is not set
   ```
   **Solution**: Check your backend/.env file and ensure the API key is correct.

4. **Container build fails:**
   ```
   Error: Docker build failed
   ```
   **Solution**: Run `run-docker-clean.bat` and try again.

### Viewing Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuilding Containers

If you make changes to the code:

**Production:**
```bash
docker-compose up --build -d
```

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

## Development vs Production

### Development Mode
- Hot reloading enabled
- Source code mounted as volumes
- Full development dependencies
- Detailed error messages

### Production Mode
- Optimized builds
- Minimal dependencies
- Security hardened
- Compressed assets

## Network Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (Nginx)       │◄──►│   (Node.js)     │
│   Port: 3000    │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
              Docker Network
```

## Security Features

- Non-root users in containers
- Health checks for all services
- Security headers in Nginx
- Environment variable isolation
- Network isolation

## Performance Optimization

- Multi-stage builds for smaller images
- Asset compression and caching
- Optimized Nginx configuration
- Node.js production mode

## Monitoring

Health checks are available at:
- Frontend: http://localhost:3000/health
- Backend: http://localhost:5000/api/test

## Support

If you encounter issues:

1. Check Docker Desktop is running
2. Verify environment variables are set
3. Run `run-docker-clean.bat` and try again
4. Check logs with `docker-compose logs -f`
5. Ensure ports 3000 and 5000 are available
