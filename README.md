# EKART - MERN E-Commerce Platform

EKART is a full-stack e-commerce application built with React (Vite), Express, and MongoDB.
This project includes user auth, product browsing, cart/checkout, payment integration, admin panels, and analytics.

## Tech Stack

- Frontend: React, Redux Toolkit, Tailwind CSS, shadcn/ui, Framer Motion
- Backend: Node.js, Express, MongoDB (Mongoose), Zod validation
- Integrations: Cloudinary (media), Razorpay (payments)

## Monorepo Structure

- `frontend` - customer/admin UI app
- `backend` - REST API, auth, business logic, DB models

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas or local MongoDB
- Cloudinary account
- Razorpay account

## Setup

1. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Create environment files:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
3. Create a root `.gitignore` if it does not exist. It should include the current date on the first line, for example:
   - `# Created on 2026-05-15`
4. Start backend:
   - `cd backend`
   - `npm start`
5. Start frontend:
   - `cd frontend`
   - `npm run dev`

## Environment files

- `backend/.env.example` contains backend secrets and API keys.
- `frontend/.env.example` contains frontend build variables.
- Do not commit `.env` files or real credentials to version control.

## Scripts

### Backend

- `npm start` - run API with nodemon

### Frontend

- `npm run dev` - run local Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Repository files

- `.gitignore` - ignores node_modules, env files, build outputs, logs, and editor folders.
- `backend/.env.example` - sample backend env variables
- `frontend/.env.example` - sample frontend env variables

## Security and Platform Notes

- API uses rate limiting (`/api`) and security headers via Helmet.
- Input validation is performed with Zod on key auth/cart/order endpoints.
- Global not-found and error middleware now return consistent JSON error responses.
- Avoid committing real credentials in `.env`; keep only placeholders in `.env.example`.
