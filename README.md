<div align="center">
  <img src="frontend/public/icons.svg" alt="CareBridge Logo" width="100"/>
  <h1>CareBridge Smart Healthcare</h1>
  <p><strong>Bridging the gap to life-saving healthcare using predictive geo-routing AI.</strong></p>
</div>

---

## 🚀 Overview

**CareBridge** is a premium, production-grade healthcare platform designed to connect critical patients with verified medical volunteers instantly. Built with a responsive React frontend and a robust Node/Express backend, the system utilizes a proprietary predictive geo-routing matching algorithm to ensure rapid, location-aware medical intervention.

## ✨ Key Features

- **Automated Triage Engine:** Instantly parses incoming requests to assign dynamic urgency scores (High, Medium, Low).
- **Geo-Routing Matching AI:** Intelligently maps the nearest verified medical professionals (Doctors, Nurses, Drivers) to patients based on live city data.
- **Real-Time Polling & Notifications:** Instant cross-platform alerts for high-priority requests without heavy websocket payloads.
- **Enterprise Analytics Dashboard:** Built-in interactive Recharts analyzing requests by city, required skills, and urgency distribution.
- **One-Click Export Logic:** Seamless native CSV generation and PDF extraction for local NGO offline record-keeping.
- **Premium Dark Mode Architecture:** Flawless True Navy (`#0B1220`) theme integration powered by CSS Variables and Tailwind JIT.

## 💻 Tech Stack

**Frontend:**
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Document Generation**: jsPDF, jsPDF-AutoTable

**Backend:**
- **Framework**: Node.js + Express
- **Data Persistence**: Lightweight JSON file system architecture
- **Middleware**: CORS, native body parsers

## 📸 Platform Previews

> *Placeholders for your deployment screenshots*
> - **[Screenshot 1: The Predictive Dashboard]**
> - **[Screenshot 2: Real-time Form Intake]**
> - **[Screenshot 3: True Navy Dark Mode]**

## ⚙️ Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/adithyancp123/carebridge-smart-healthcare.git
   cd carebridge-smart-healthcare
   ```

2. **Start the Backend**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *(Server starts on port 5000)*

3. **Start the Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *(Client starts on port 5173)*

## 🌍 Deployment Strategy

CareBridge is optimized for immediate zero-config deployment.

- **Frontend (Vercel):** The `frontend/vercel.json` file ensures that React Router's single-page application structure works flawlessly in production.
- **Backend (Render):** The `backend/render.yaml` configuration is ready to map your Node service seamlessly. 

## 📂 Architecture

```text
carebridge-smart-healthcare/
├── backend/
│   ├── server.js          # Express entry point
│   ├── data.json          # Persistent file storage
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI widgets
│   │   ├── pages/         # Core application views
│   │   ├── index.css      # Tailwind & Global Theme CSS
│   │   ├── main.jsx       # React DOM root
│   │   └── api.js         # Axios interceptors & proxy config
│   ├── vite.config.js     # Dev server proxy routing
│   └── vercel.json        # Production routing rule
└── README.md
```

## 🌟 Why This Project Stands Out

CareBridge is not just a CRUD application. It demonstrates an understanding of **production-grade engineering principles**: 
- **Defensive Programming:** The UI handles backend failures gracefully via semantic fallbacks. 
- **Design Systems:** A robust CSS token system manages the global Dark Mode without flash-of-unstyled-content (FOUC).
- **Optimization:** Array parsing and local caching techniques prevent heavy DOM re-renders during analytics aggregation.
