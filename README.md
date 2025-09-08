# ClaimDesk 🧾 - Lost & Found Web App

ClaimDesk is a MERN stack web application designed to streamline the process of reporting and claiming lost or found items. Whether you're a student, employee, or visitor, ClaimDesk helps you quickly report an item or find what's missing.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Passport.js (Google, Facebook, Apple ID)
- **Cloud Storage**: Cloudinary (for item images)

## 📦 Features

### 👤 User Features
- Register and login (email/password or via Google/Facebook/Apple)
- Report lost or found items with image, location, and description
- View and manage items you reported
- Browse all lost/found items by others
- Claim items you recognize as yours
- Status update (Lost / Found / Resolved)

### 🛡️ Admin Features
- Admin dashboard to view all users and items
- Delete inappropriate items or users
- View claimed items and manage reported content

## 🔐 Authentication

- Traditional login/signup (JWT-based)
- OAuth with Google, Facebook, and Apple ID using Passport.js
- Redirects user to frontend with token on successful login

