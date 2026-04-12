🚀 FE Chat Bot

Frontend for a real-time AI chat application built with React.
This project provides a modern chat experience with real-time communication, authentication, and scalable state management.

Demo

Production:
https://chatdemo.site

Features

Real-time chat using Server-Sent Events (SSE)
WebSocket connection with Socket.IO
Authentication with JWT + Refresh Token
Automatic refresh token handling
Chat conversation management
Modern responsive UI
Optimized API handling using RTK Query
Global state management with Redux Toolkit

Tech Stack

Frontend
React
Vite
Redux Toolkit
RTK Query
Socket.IO client
TailwindCSS

Backend communication
REST API
SSE (Server Sent Events)
WebSocket (Socket.IO)

Deployment
Nginx
Cloudflare
PM2 (backend)

src
├── api
│ ├── baseQuery.js
│ ├── baseQueryWithReauth.js
│
├── components
│
├── context
│ └── SocketContext.jsx
│
├── feature
│ └── user
│
├── pages
│
├── services
│
├── utils
│
└── main.jsx

Getting Started

1.  Install dependencies
    npm install
2.  Run development server
    npm run dev
3.  Build for production
    npm run build

Authentication Flow
Access token stored in memory / state
Refresh token handled automatically via API
Failed requests are retried after token refresh
Secure communication with credentials enabled

Real-time Communication
SSE used for AI streaming responses
Socket.IO used for:
user-to-user messaging
online status
real-time events

Notes
Ensure backend server is running before starting frontend
Check correct API URLs in .env
Restart dev server after changing environment variables

✍️ Author: TruongVD
