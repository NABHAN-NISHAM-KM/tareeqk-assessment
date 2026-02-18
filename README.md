# 🚗 Tareeqk – Car Recovery & Towing Request System

> Full-stack towing request platform built with **Laravel**, **React**, and **React Native**

---

## 📁 Project Structure
```
tareeqk/
├── backend/         # Laravel 10 REST API
├── web-customer/    # React 18 Customer Web App
├── mobile-driver/   # React Native (Expo) Driver App
└── README.md
```

---

## ✨ Features

### Core Features
- ✅ **Customer Request System** – Submit towing requests via web
- ✅ **Driver Dashboard** – View and manage requests via mobile app
- ✅ **RESTful API** – Clean Laravel backend with MySQL database
- ✅ **Status Management** – Track requests (Pending → Assigned → Completed)

### 🌟 Bonus Features
- 🔐 **Authentication** – Login/register for customers and drivers (Laravel Sanctum)
- ✅ **Accept & Complete Requests** – Drivers can accept and mark requests as done
- 🔄 **Real-time Updates** – Auto-polling every 5 seconds for live updates
- 📍 **Maps Integration** – Google Maps for location picking and viewing
- 📱 **Responsive Design** – Web app works on all screen sizes

---

## 🛠️ Tech Stack

| **Backend** | Laravel 10, MySQL 8, Sanctum Auth |
| **Web App** | React 18, Vite, Axios, Google Maps API |
| **Mobile App** | React Native, Expo, React Native Maps |
| **Real-time** | Polling (5s intervals) or Laravel Reverb |

---

## 🚀 Quick Start

### Prerequisites

- **PHP** 8.1+
- **Composer**
- **Node.js** 18+
- **MySQL** 8+
- **Expo CLI** (for mobile): `npm install -g expo-cli`

---

## 1️⃣ Backend Setup (Laravel)
```bash
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
# DB_DATABASE=tareeqk
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Create database (in MySQL)
# CREATE DATABASE tareeqk;

# Run migrations & seed demo data
php artisan migrate:fresh --seed

# Start server
php artisan serve
# API runs at http://localhost:8000
```

---

## 2️⃣ Web Customer Setup (React)
```bash
cd web-customer

# Install dependencies
npm install

# Update API URL in src/config.js if needed
# export const API_BASE_URL = 'http://localhost:8000/api';

# (Optional) Add Google Maps API key
# export const GOOGLE_MAPS_API_KEY = 'YOUR_KEY_HERE';

# Start dev server
npm run dev
# Web app runs at http://localhost:5173
```

---

## 3️⃣ Mobile Driver Setup (React Native)
```bash
cd mobile-driver

# Install dependencies
npm install

# IMPORTANT: Update API URL with your local API URL
# Edit src/config.js:
# export const API_BASE_URL = 'http://localhost:8000/api';

# Start Expo
npx expo start

# Then:
# - Press 'w' for web
# - Scan QR code with Expo Go app on your phone
```

---

## 📡 API Endpoints


| **POST** | `/api/register` | Register new user |
| **POST** | `/api/login` | Login user |
| **POST** | `/api/logout` | Logout user |
| **GET** | `/api/me` | Get current user |
| **GET** | `/api/requests` | List all requests |
| **POST** | `/api/requests` | Create new request |
| **PATCH** | `/api/requests/{id}/accept` | Driver accepts request |
| **PATCH** | `/api/requests/{id}/complete` | Driver completes request |

---

## 🔑 Demo Credentials

### Customer Account
```
Email: ahmed@customer.com
Password: password
```

### Driver Account
```
Email: khalid@driver.com
Password: password
```

---


## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **419 CSRF Error** | Add `'api/*'` to `app/Http/Middleware/VerifyCsrfToken.php` `$except` array |
| **CORS Error** | Set `'allowed_origins' => ['*']` in `config/cors.php` |
| **Migration Key Error** | Add `Schema::defaultStringLength(191);` to `AppServiceProvider::boot()` |
| **Mobile can't reach API** | Use your machine's local IP (not `localhost`) in mobile config |

---

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 👨‍💻 Developer

Built as a full-stack developer assessment for **Tareeqk**.

**Tech Stack:** Laravel · React · React Native · MySQL · Google Maps API

---

## 🙏 Acknowledgments

- Laravel documentation
- React & React Native communities
- Google Maps Platform
- Expo team