# AI Resume Tailor

An AI-powered application that helps tailor resumes to specific job descriptions using Google's Gemini AI.

## Features

- Upload resume in DOCX format
- Input job description
- AI-powered resume tailoring
- Dark mode support
- Print/PDF export functionality

## Setup

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install:all
```

3. Configure environment variables:

Frontend (.env in frontend folder):
```
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your-gemini-api-key
```

Backend (.env in backend folder):
```
PORT=5000
GEMINI_API_KEY=your-gemini-api-key
```

### Development

To run both frontend and backend in development mode:

```bash
npm start
```

The frontend will be available at http://localhost:3000
The backend API will be available at http://localhost:5000

## Building for Production

Frontend:
```bash
cd frontend && npm run build
```

The build output will be in the `frontend/dist` folder.

## Tech Stack

- Frontend:
  - React
  - Vite
  - TailwindCSS
  - Google Generative AI SDK

- Backend:
  - Node.js
  - Express
  - Google Generative AI SDK

## License

MIT
