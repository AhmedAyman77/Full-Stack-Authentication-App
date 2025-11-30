# Full-Stack-Authentication-App

Table of Contents
- [Overview](#overview)
- [Diagram](#diagram)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Detailed File Explanations](#detailed-file-explanations)
- [API Endpoints & Examples](#api-endpoints--examples)
- [Quickstart (Local)](#quickstart-local)
- [Deployment (Azure VM) — pm2 + nginx](#deployment-azure-vm---pm2--nginx)
- [Direct Tests (public IP)](#direct-tests-public-ip)
- [Contact](#contact)
- [All Files](#all-files)

## Overview
This repository is a MERN stack authentication boilerplate that stores JWTs in HTTP-only cookies. Backend is Express + MongoDB; frontend is React (Vite) + Redux Toolkit with RTK Query. Auth flows: register, login, logout, get profile, update profile.

## Diagram
Simple flow (frontend ↔ backend ↔ DB):

Frontend (React) <--> Express API (JWT in httpOnly cookie) <--> MongoDB

ASCII:
```
Browser  <--->  Nginx (optional)  <--->  Express (server/server.js)  <--->  MongoDB
   |                                          |
Client UI (React)                          Auth Middleware (cookie JWT)
```

## Technologies Used
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- React + Vite
- Redux Toolkit + RTK Query
- React Router
- Bootstrap / React-Bootstrap
- pm2 (process manager)
- nginx (reverse proxy)
- Deployment: Azure VM (public IP provided)

## Project Structure
```
.env.example
.gitignore
package.json
README.md
.vscode/
    settings.json
client/
    .gitignore
    eslint.config.js
    index.html
    package.json
    vite.config.js
    public/
    src/
        App.jsx
        index.css
        main.jsx
        store.js
        assets/
        components/
            hero.jsx
            header.jsx
            PrivateRoute.jsx
            Loader.jsx
            FormContainer.jsx
        screens/
            homeScreen.jsx
            LoginScreen.jsx
            RegisterScreen.jsx
            ProfileScreen.jsx
        slices/
            apiSlice.js
            usersApiSlice.js
            authSlice.js
server/
    server.js
    config/
        db.js
    controller/
        userController.js
    middleware/
        authMiddleware.js
        erroMiddleware.js
    models/
        userModel.js
    routes/
        userRoutes.js
    utils/
        generateToken.js
```

## Detailed File Explanations (key files & symbols)
- Server entry: [`server/server.js`](server/server.js)
- DB connection: [`connectDB`](server/config/db.js) — see [`connectDB`](server/config/db.js)
- User model: [`User`](server/models/userModel.js) — see [`User`](server/models/userModel.js)
- Token generator: [`generateToken`](server/utils/generateToken.js)
- Controllers: [`loginUser`](server/controller/userController.js), [`registerUser`](server/controller/userController.js), [`logout`](server/controller/userController.js), [`getUserProfile`](server/controller/userController.js), [`updateUserProfile`](server/controller/userController.js) — see [server/controller/userController.js](server/controller/userController.js)
- Routes: [`userRouter`](server/routes/userRoutes.js) — see [server/routes/userRoutes.js](server/routes/userRoutes.js)
- Auth middleware: [`protect`](server/middleware/authMiddleware.js) — see [server/middleware/authMiddleware.js](server/middleware/authMiddleware.js)
- Error handlers: [`notFound`](server/middleware/erroMiddleware.js), [`errorHandler`](server/middleware/erroMiddleware.js) — see [server/middleware/erroMiddleware.js](server/middleware/erroMiddleware.js)
- Client store: [`store`](client/src/store.js)
- Client API: [`apiSlice`](client/src/slices/apiSlice.js), [`userApiSlice`](client/src/slices/usersApiSlice.js)
- Client auth state: [`setCredentials`](client/src/slices/authSlice.js), [`logout`](client/src/slices/authSlice.js)
- Routing / protection: [`PrivateRoute`](client/src/components/PrivateRoute.jsx)
- Header / UI components: [`Header`](client/src/components/header.jsx), [`Loader`](client/src/components/Loader.jsx), [`FormContainer`](client/src/components/FormContainer.jsx), [`Hero`](client/src/components/hero.jsx)
- Client routes / pages: [client/src/screens/LoginScreen.jsx](client/src/screens/LoginScreen.jsx), [client/src/screens/RegisterScreen.jsx](client/src/screens/RegisterScreen.jsx), [client/src/screens/ProfileScreen.jsx](client/src/screens/ProfileScreen.jsx), [client/src/screens/homeScreen.jsx](client/src/screens/homeScreen.jsx)

(Each file above is present at the indicated path. See the Files section below for direct links.)

## API Endpoints & Examples
All endpoints are under /api/users (see [`userRouter`](server/routes/userRoutes.js)).

Base (production): http://40.66.49.167  (example public IP)

Backend base URL (default): http://localhost:5000 when developing.

Examples (use JSON, Content-Type: application/json):

1) Register
- Route: POST /api/users/register
- Controller: [`registerUser`](server/controller/userController.js)
- Example:
```bash
curl -X POST http://40.66.49.167:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}' \
  -c cookies.txt
```
Response: JSON with user {_id, name, email}. Cookie `jwt` set in httpOnly cookie.

2) Login
- Route: POST /api/users/login
- Controller: [`loginUser`](server/controller/userController.js)
- Example:
```bash
curl -X POST http://40.66.49.167:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' \
  -c cookies.txt
```
Response: JSON user info and httpOnly `jwt` cookie.

3) Logout
- Route: POST /api/users/logout
- Controller: [`logout`](server/controller/userController.js)
- Example:
```bash
curl -X POST http://40.66.49.167:5000/api/users/logout \
  -b cookies.txt
```
Response: { message: 'Logged out successfully' } and cookie cleared.

4) Get profile (protected)
- Route: GET /api/users/profile
- Middleware: [`protect`](server/middleware/authMiddleware.js)
- Example (use cookie from login):
```bash
curl -X GET http://40.66.49.167:5000/api/users/profile \
  -b cookies.txt
```
Response: JSON { _id, name, email }.

5) Update profile (protected)
- Route: PUT /api/users/profile
- Controller: [`updateUserProfile`](server/controller/userController.js)
- Example:
```bash
curl -X PUT http://40.66.49.167:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Alice Updated","email":"alice@example.com","password":"newpass"}'
```

Notes:
- All examples assume backend running on port 5000. The production server serves the client when NODE_ENV=production (see [`server/server.js`](server/server.js)).
- Cookies are httpOnly; use `-c` and `-b` with curl to store/send cookies.

## Quickstart (Local)
1. Copy `.env.example` with required variables (do not commit secrets). Required:
   - MONGO_URI
   - JWT_SECRET
   - PORT (optional)
   - NODE_ENV (optional)
2. Install root deps:
```bash
npm install
```
3. Start dev (server + client):
```bash
npm run dev
```
- Server runs via nodemon on default port (5000).
- Client runs via Vite (3000). Proxy for /api defined in [client/vite.config.js](client/vite.config.js).

Build production client:
```bash
cd client
npm run build
# copy client/dist to server (server serves client/dist in production)
```

## Deployment (Azure VM) — pm2 + nginx
Summary steps (high-level):
1. Provision an Azure VM (Ubuntu). Ensure Node.js, npm, pm2, nginx installed.
2. Clone repo on VM and set environment variables (use .env or systemd/env).
3. Install dependencies:
```bash
npm install
cd client
npm install
npm run build
cd ..
```
4. Start server with pm2:
```bash
# from project root
pm2 start server/server.js --name auth-server
pm2 save
```
5. nginx config (example) — create `/etc/nginx/sites-available/auth` and symlink to `sites-enabled`:
```nginx
server {
    listen 80;
    server_name 40.66.49.167;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
    }
}
```
Reload nginx:
```bash
sudo ln -s /etc/nginx/sites-available/auth /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
6. Ensure firewall rules allow port 80 (and 443 if using TLS). Recommend enabling HTTPS (Certbot).

Notes:
- PM2 will keep the Node process running and restart on crash. Use `pm2 logs auth-server` for logs.
- The production build of the React app is served by Express when NODE_ENV=production (see [`server/server.js`](server/server.js)), so nginx proxies to Express.

## Direct Tests (public IP)
Frontend (if production build is served):
- Visit http://40.66.49.167 in a browser.

API tests:
- Register:
```bash
curl -X POST http://40.66.49.167:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123456"}' -c cookies.txt
```
- Login:
```bash
curl -X POST http://40.66.49.167:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}' -c cookies.txt
```
- Get profile:
```bash
curl -X GET http://40.66.49.167:5000/api/users/profile -b cookies.txt
```
- Logout:
```bash
curl -X POST http://40.66.49.167:5000/api/users/logout -b cookies.txt
```

## Contact
- Email: devahmedaymn@gmail.com  
- LinkedIn: [https://www.linkedin.com/in/ahmed-ayman-25a9b2248/](https://www.linkedin.com/in/ahmed-ayman-25a9b2248/)

## All files (quick links)
- [.env.example](.env.example)
- [.gitignore](.gitignore)
- [package.json](package.json)
- [.vscode/settings.json](.vscode/settings.json)

Client:
- [client/.gitignore](client/.gitignore)
- [client/eslint.config.js](client/eslint.config.js)
- [client/index.html](client/index.html)
- [client/package.json](client/package.json)
- [client/README.md](client/README.md)
- [client/vite.config.js](client/vite.config.js)
- [client/src/App.jsx](client/src/App.jsx)
- [client/src/index.css](client/src/index.css)
- [client/src/main.jsx](client/src/main.jsx)
- [client/src/store.js](client/src/store.js)
- [client/src/components/hero.jsx](client/src/components/hero.jsx)
- [client/src/components/header.jsx](client/src/components/header.jsx)
- [client/src/components/PrivateRoute.jsx](client/src/components/PrivateRoute.jsx)
- [client/src/components/Loader.jsx](client/src/components/Loader.jsx)
- [client/src/components/FormContainer.jsx](client/src/components/FormContainer.jsx)
- [client/src/screens/homeScreen.jsx](client/src/screens/homeScreen.jsx)
- [client/src/screens/LoginScreen.jsx](client/src/screens/LoginScreen.jsx)
- [client/src/screens/RegisterScreen.jsx](client/src/screens/RegisterScreen.jsx)
- [client/src/screens/ProfileScreen.jsx](client/src/screens/ProfileScreen.jsx)
- [client/src/slices/apiSlice.js](client/src/slices/apiSlice.js)
- [client/src/slices/usersApiSlice.js](client/src/slices/usersApiSlice.js)
- [client/src/slices/authSlice.js](client/src/slices/authSlice.js)

Server:
- [server/server.js](server/server.js)
- [server/config/db.js](server/config/db.js)
- [server/controller/userController.js](server/controller/userController.js)
- [server/middleware/authMiddleware.js](server/middleware/authMiddleware.js)
- [server/middleware/erroMiddleware.js](server/middleware/erroMiddleware.js)
- [server/models/userModel.js](server/models/userModel.js)
- [server/routes/userRoutes.js](server/routes/userRoutes.js)
- [server/utils/generateToken.js](server/utils/generateToken.js)
