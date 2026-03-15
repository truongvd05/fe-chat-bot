FE Chat Bot

Frontend for a real-time AI chat application built with React.
The application supports real-time messaging using Server-Sent Events (SSE) and Socket.IO, authentication with JWT + refresh token, and a modern UI.

Demo

Production:
https://chatdemo.site

Features

Real-time chat using Server-Sent Events (SSE)
WebSocket connection with Socket.IO
JWT authentication
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

✍️ Author: TruongVD
