# 💬 ChatDemo

Frontend for a real-time chat application inspired by Zalo, built with React.

🌐 **Production:** [chatdemo.site](https://chatdemo.site) &nbsp;|&nbsp; 📦 **Repo:** [github.com/truongvd05/chatdemo](https://github.com/truongvd05/chatdemo)

---

## ✨ Features

### 💬 Chat

- Real-time messaging with **Socket.IO** (WebSocket)
- Typing indicator & online/offline status
- Group chat support
- Chat conversation management

### 🔐 Authentication

- JWT with Access Token + Refresh Token
- Automatic silent token refresh
- Email verification & forgot password flow
- Secure credential-based communication

### ⚡ Performance

- API latency reduced **30–50%** via Redis caching & rate limiting on critical endpoints
- Optimized API calls with RTK Query (caching, deduplication, auto re-fetch)

---

## 🧰 Tech Stack

| Layer            | Technology               |
| ---------------- | ------------------------ |
| UI Framework     | React + Vite             |
| State Management | Redux Toolkit, RTK Query |
| Styling          | TailwindCSS              |
| Real-time        | Socket.IO client         |
| Deployment       | Nginx, Cloudflare        |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── baseQuery.js             # Axios base query config
│   └── baseQueryWithReauth.js  # Auto refresh token interceptor
│
├── components/                 # Shared UI components
│
├── context/
│   └── SocketContext.jsx       # Global Socket.IO connection
│
├── feature/
│   └── user/                   # User slice (Redux)
│
├── pages/                      # Route-level pages
│
├── services/                   # RTK Query API service definitions
│
├── utils/                      # Helper functions
│
└── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Backend server running — see [chatdemo backend repo](#)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/truongvd05/chatdemo.git
cd chatdemo

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your API and Socket URLs

# 4. Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## ⚙️ Environment Variables

```env
VITE_API_URL=https://your-api-url.com
VITE_SOCKET_URL=https://your-socket-url.com
```

> ⚠️ Restart the dev server after changing `.env` values.

---

## 🔐 Authentication Flow

```
Login
  │
  ▼
Access Token (stored in memory)
  │
  ├─ Request succeeds ───────────────► Response
  │
  └─ 401 Unauthorized
         │
         ▼
  Refresh Token (httpOnly cookie)
         │
         ├─ Valid ──► New Access Token ──► Retry original request
         │
         └─ Invalid ──► Redirect to Login
```

---

## 🔌 Real-time Communication

| Protocol                  | Usage                                                                |
| ------------------------- | -------------------------------------------------------------------- |
| **WebSocket** (Socket.IO) | Messaging, typing indicator, online status, unread, real-time events |

---

## 👤 Author

**Vũ Đình Trường**  
📧 truongbk444@gmail.com  
🐙 [github.com/truongvd05](https://github.com/truongvd05)  
🌐 [chatdemo.site](https://chatdemo.site)
