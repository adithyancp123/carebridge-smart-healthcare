# CareBridge Smart Healthcare

> Bridging the gap between patients in urgent need and verified volunteers through intelligent healthcare support workflows.

![React](https://img.shields.io/badge/Frontend-React%2019-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/API-Express-black)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38BDF8)
![Status](https://img.shields.io/badge/Build-Production%20Ready-success)

---

## 📌 Overview

**CareBridge Smart Healthcare** is a full-stack healthcare assistance platform built to support NGOs, volunteer organizations, and emergency support teams.

The platform enables:

- Patients to request urgent healthcare assistance
- Volunteers to register their availability and skills
- Administrators to monitor requests in real time
- Smart priority handling for emergency cases
- Analytics-driven decision making

CareBridge is designed with a modern product mindset, combining premium UI/UX with practical workflow automation.

---

## ✨ Core Features

### 🏥 Patient Support System
Users can submit healthcare assistance requests with urgency level, city, medical need, and contact details.

### 🤝 Volunteer Registration
Doctors, nurses, drivers, caretakers, and helpers can register their availability.

### 🧠 Smart Priority Engine
Requests are automatically prioritized based on urgency and medical keywords.

Examples:

- Blood required urgently
- Surgery support needed
- Oxygen required
- Emergency transport

### 📊 Admin Dashboard
A centralized control panel with:

- Total requests
- Total volunteers
- Critical requests
- Live metrics
- Search & filters
- Status tracking

### 📈 Analytics Center
Interactive charts for:

- Requests by city
- Urgency distribution
- Volunteer skill categories
- Status breakdown

### 📁 Export System
Admins can export data instantly:

- CSV Reports
- PDF Summaries

### 🌙 Premium Dark Mode
Production-grade theme engine with:

- Persistent theme preference
- No flash on load
- Fully themed charts, cards, forms, and navbar

### 🔔 Notifications & Activity Feed
Track platform activity in real time:

- New patient requests
- Volunteer joins
- Priority alerts
- Request resolution updates

---

## 🚀 Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS v4
- Framer Motion
- Recharts
- Lucide React
- jsPDF

## Backend

- Node.js
- Express.js
- JSON File Storage
- REST API Architecture
- CORS Enabled

---

## 🧱 Project Architecture

```text
carebridge-smart-healthcare/
│
├── backend/
│   ├── server.js
│   ├── data.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── vite.config.js
│   └── package.json
│
└── README.md