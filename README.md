# CareBridge – Mini Healthcare Support Web App

CareBridge is a concept-level healthcare support platform built to connect patients in urgent need with volunteers and NGOs quickly through a simple digital system. The project was created as part of an internship assignment focused on building a healthcare support web app with one AI or automation feature.

## Live Demo

Frontend (Vercel):  
https://carebridge-smart-healthcare.vercel.app

Backend API (Render):  
https://carebridge-backend-e28k.onrender.com

## GitHub Repository

https://github.com/adithyancp123/carebridge-smart-healthcare

---

## Problem Statement

During emergencies, many people struggle to quickly find help for:

- Oxygen / medicines
- Blood donation
- Transport support
- Volunteer assistance
- Emergency coordination

CareBridge aims to simplify this process through an easy web-based platform.

---
<img width="1891" height="959" alt="Screenshot 2026-04-24 191206" src="https://github.com/user-attachments/assets/925b1602-92ac-48e8-9881-daa84ed445b1" />

## Features

### Patient Support Form
Users can submit emergency healthcare requests with:

- Name
- Contact details
- Location
- Medical need
- Urgency level
<img width="1895" height="970" alt="Screenshot 2026-04-24 191229" src="https://github.com/user-attachments/assets/458f5d9d-7e6f-4786-8c20-1e2b6d5ab6ba" />

### Volunteer Registration Form
Volunteers can register with:

- Name
- Contact info
- Skills
- Availability
- City / Area
<img width="1900" height="969" alt="Screenshot 2026-04-24 191246" src="https://github.com/user-attachments/assets/36e9fcf5-c403-401e-bcf9-d190a73e1cbd" />

### Dashboard
Basic request and volunteer data view for monitoring.
<img width="1900" height="963" alt="Screenshot 2026-04-24 191302" src="https://github.com/user-attachments/assets/5cd3c026-c148-429a-ae84-f7684d9cfacf" />

### Responsive UI
Modern clean interface optimized for desktop and mobile.

---

## AI / Automation Idea Implemented

### Smart Matching AI Concept
The platform introduces a **Live Matching AI Engine** concept that can automatically connect nearby volunteers to urgent patient requests based on:

- Location
- Availability
- Urgency priority
- Type of help needed

### Automated Email Notification System
Integrated using **Resend API**:

- Admin receives emergency alerts
- Users receive confirmation emails
- Graceful fallback if email server is unavailable

---

## NGO Use Case

NGOs and support organizations can use CareBridge to:

- Collect emergency requests digitally
- Manage volunteer registrations
- Get real-time alerts
- Respond faster during crisis situations
- Improve support coordination

---

## Tech Stack

### Frontend
- React.js
- Vite
- CSS / Modern UI Components

### Backend
- Node.js
- Express.js

### Deployment
- Vercel (Frontend)
- Render (Backend)

### APIs / Tools
- Resend Email API

---

## Project Structure

```bash
carebridge-smart-healthcare/
│── frontend/
│── backend/
│── README.md
