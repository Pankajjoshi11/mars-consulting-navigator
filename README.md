# Mars Consulting Website

Official website source code for Mars Consulting.

## Overview

This repository contains the frontend website and supporting backend code used for contact form handling and related website functionality.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Express.js
- Cloudflare Pages

## Project Structure

- `src/` - Frontend source code
- `public/` - Static assets
- `backend/` - Backend/API code
- `package.json` - Frontend scripts and dependencies

## Local Development

### Frontend

```bash
npm install
npm run dev
```

The frontend development server usually runs at `http://localhost:5173`.

### Backend

```bash
node backend/server.js
```

The backend runs locally on port `5000` unless a different `PORT` is provided.

## Environment Variables

Create a `.env` file in the project root for backend services if needed.

Example:

```env
RESEND_API_KEY=your_api_key_here
PORT=5000
```

## Deployment

This project is intended to be deployed through Cloudflare Pages using the connected GitHub repository.

Before deploying:

- Ensure the production branch is up to date
- Confirm required environment variables are configured
- Test the website locally after major changes

## Maintenance Notes

- Update page content and UI from files inside `src/`
- Keep API keys and secrets out of version control
- Review changes before pushing to the production branch

## Ownership

This repository contains the website codebase for Mars Consulting and should be maintained only by authorized team members.
