# CareBridge - Healthcare NGO Platform

![CareBridge Cover](https://via.placeholder.com/1200x400/1e3a8a/ffffff?text=CareBridge+Healthcare+Support+Platform)

CareBridge is a production-ready, full-stack web application designed for Healthcare NGOs. It serves as a rapid-response bridging platform that seamlessly connects patients in critical need with nearby available medical volunteers (Doctors, Nurses, Drivers, Caretakers). 

Built with modern engineering principles, it features AI-powered intelligent request summarization, automated city-based volunteer matching, and a highly polished startup-grade UI.

## 🌟 Why This Project Stands Out (For Engineering Recruiters)
- **Advanced State Management**: Clean React architectural flow utilizing hooks and strict component modularity.
- **Micro-Animations**: Extensive use of Framer Motion for premium user interactions and routing transitions.
- **Smart Algorithm Integration**: Implemented a dynamic matching engine that actively correlates patient geographic data with volunteer availability.
- **Live Impact Architecture**: The dashboard and home page utilize polling to display real-time live statistics and automated emergency banners, proving an understanding of real-time event-driven UX.
- **Vite & Tailwind v4 Ecosystem**: Showcases proficiency in the absolute latest front-end tooling ecosystems for scalable development.

## 🚀 Key Highlights & Features

1. **Intelligent Automation (AI-Powered Engine)**:
   - **Smart Summarization**: Form submissions are instantly processed into intelligent, human-readable summaries (e.g., *"CRITICAL: Patient request from Thrissur. A 65-year-old requires immediate assistance regarding: Cardiac arrest."*).
   - **Real-Time Volunteer Matching**: Automatically scans the volunteer database to find and suggest an available match in the same city as the patient.

2. **Premium Frontend Architecture**:
   - Built with **React 19** and **Vite** for blazing fast performance.
   - Designed using **Tailwind CSS v4** with a bespoke Glassmorphism NGO theme (Deep Blues and Emerald Greens).
   - Fluid micro-animations and route transitions powered by **Framer Motion**.
   - Elegant toast notification system for form feedback.

3. **Robust Backend & Dashboard**:
   - **Node.js / Express** REST API.
   - Dedicated Admin Dashboard featuring interactive tabs, real-time search filtering, and metric counter cards.

## 📸 Screenshots

*(Screenshots can be found in the `/screenshots` directory)*
- **Homepage:** `screenshots/homepage.png`
- **Patient Form:** `screenshots/patient-form.png`
- **Volunteer Form:** `screenshots/volunteer-form.png`
- **Dashboard:** `screenshots/dashboard.png`

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, Framer Motion, React Router v7, React Hot Toast, Lucide React, Axios.
- **Backend**: Node.js, Express, CORS, File System (`fs`) for lightweight JSON persistence.

## ⚙️ Local Setup & Run Instructions

This project requires [Node.js](https://nodejs.org/) to be installed.

### 1. Start the Backend API

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:5000`):
   ```bash
   npm start
   ```

### 2. Start the Frontend Client

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

## 🌐 Deployment Guidelines

The project is structured to be deployment-ready. 

**Frontend (Vercel / Netlify)**:
- Build command: `npm run build`
- Output directory: `dist`
- *Note:* Add an environment variable `VITE_API_URL` pointing to your hosted backend URL.

**Backend (Render / Heroku)**:
- Start command: `node server.js`
- *Note on Data Persistence:* The current backend uses a local `data.json` file. Serverless platforms (like Vercel functions) have ephemeral file systems and will reset this file on every cold start. For production, host the Node.js app on a service with a persistent disk (like Render) or replace `fs` logic with a managed database like MongoDB.

---
*Developed as a premier Full-Stack Developer Internship Submission.*
