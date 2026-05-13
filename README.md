# MediTrack
**Medication Adherence, Side-Effect Monitoring & Health Risk Assessment System**

MediTrack is a healthcare-focused web application designed to help patients manage prescribed medications efficiently. The system allows users to schedule medicines, track dose completion, record side effects, monitor medication adherence, receive automated email reminders, and assess 10-year cardiovascular disease risk using machine learning.

---

# Table of Contents
* [Overview](#overview)
* [Problem Statement](#problem-statement)
* [Objectives](#objectives)
* [Features](#features)
* [System Architecture](#system-architecture)
* [Technology Stack](#technology-stack)
* [Installation](#installation)
* [Future Enhancements](#future-enhancements)
* [Academic Integrity](#academic-integrity)

---

# Overview

Medication adherence is an important factor in successful treatment outcomes. Many patients struggle to follow medication schedules, track missed doses, monitor side effects, or understand their cardiovascular health risks.

**MediTrack** provides a centralized platform that helps patients:
* Schedule and manage medications
* Track dose completion and missed doses
* Record and monitor side effects
* Monitor adherence statistics and reports
* Receive automated email reminders at the exact scheduled medication time
* Assess 10-year heart disease risk through a machine learning model
* Assign caregivers to monitor patient medication activity
* Review treatment progress over time

The system helps improve medication compliance and promotes better healthcare management.

---

# Problem Statement

Medication non-adherence is a major challenge in healthcare. Patients often:
* Forget medication timings
* Miss doses without tracking them
* Ignore or forget to record side effects
* Lack visibility into their medication routines
* Have no accessible way to assess cardiovascular disease risk early

These issues can reduce treatment effectiveness and lead to serious health complications.

MediTrack solves this problem by offering a **structured medication monitoring, tracking, reminder, and health risk assessment system**.

---

# Objectives

The main objectives of MediTrack include:
* Developing a full-stack medication management system
* Allowing patients to schedule and manage medications with dosage and timing
* Automatically tracking completed and missed doses
* Recording medication side effects with severity levels
* Generating adherence reports and statistics
* Sending automated email reminders at each medication's scheduled time
* Providing a 10-year cardiovascular risk prediction powered by a trained ML model
* Supporting caregiver access to monitor patient medication activity
* Providing a simple, user-friendly, and mobile-responsive healthcare platform

---

# Features

## User Profile Management
* Patient registration with personal and health information
* Secure login with JWT-based authentication
* Profile display with personal details

## Medication Scheduling
* Add medications with name, dosage, and timing
* Define treatment duration (fixed days or ongoing)
* Manage and view multiple medications
* Edit and delete existing medications

## Dose Tracking
* Mark medications as taken with one tap
* Automatically detect and record missed doses after 30 minutes
* Visual indicators for taken, upcoming, and missed doses
* Daily progress tracking with adherence percentage

## Side-Effect Logging
* Record side effects linked to specific medications
* Assign severity levels: Mild, Moderate, or Severe
* View and manage side effect history

## Adherence Reports
* Calculate overall medication adherence percentage
* Display daily taken and missed dose statistics
* Visual adherence charts and summaries
* Historical adherence data per medication

## Email Reminders
* Patients register an email address for medication reminders
* Email ownership is verified using a 6-digit OTP sent to the provided address
* OTP expires after 10 minutes and is single-use for security
* Resend cooldown prevents OTP spam
* Automated email reminders sent at the exact scheduled time of each medication
* Reminder email includes medication name, dosage, and scheduled time
* Users can update or remove their reminder email at any time

## Heart Disease Risk Prediction
* Patients can assess their 10-year cardiovascular disease risk
* Powered by a machine learning model trained on the Framingham Heart Study dataset
* Users input 15 clinical parameters:
  * Personal: sex, age, education level
  * Lifestyle: smoking status, cigarettes per day
  * Medical history: blood pressure medication, prior stroke, hypertension, diabetes
  * Clinical measurements: total cholesterol, systolic BP, diastolic BP, BMI, heart rate, glucose
* Model returns a risk classification — **Low Risk** or **High Risk** — with a probability percentage
* Past assessments are saved to the database and viewable in a history tab
* Results displayed with a clear visual banner and medical disclaimer

## Caregiver Access
* Patients can assign a caregiver to their account
* Caregivers can view the patient's medication schedule and adherence
* Separate caregiver login and dashboard

## Notification System
* In-app notifications for upcoming medication times
* Alerts for missed doses
* Daily greeting and progress updates

---

# System Architecture

MediTrack follows **Hexagonal Architecture** (Ports and Adapters) on the backend, ensuring clean separation between business logic and infrastructure.

```
React Client (Vite)
        │
        ▼
Express REST API (Node.js)
        │
        ├── Domain Layer         — Entities, business rules
        ├── Application Layer    — Use cases, port interfaces
        └── Adapters Layer       — MongoDB repositories, HTTP controllers, routes
                  │
                  ├── MongoDB (Atlas)
                  ├── Resend (Email Service)
                  └── Python ML Microservice (Flask + Gunicorn)
                                │
                         heart_model.pkl
                           scaler.pkl
```

---

# Technology Stack

## Frontend
* React.js (Vite)
* Axios for HTTP requests
* Custom CSS-in-JS styling

## Backend
* Node.js with Express.js
* Hexagonal Architecture (Ports and Adapters)
* JSON Web Tokens (JWT) for authentication
* node-cron for scheduled tasks and missed dose detection
* Resend for transactional emails (OTP verification + reminders)
* Helmet for HTTP security headers
* express-mongo-sanitize for NoSQL injection prevention
* express-rate-limit for brute force protection

## Machine Learning Microservice
* Python 3 with Flask
* scikit-learn
* NumPy
* Gunicorn as production WSGI server

## Database
* MongoDB with Mongoose ODM
* MongoDB Atlas (cloud hosted)

## Deployment
* **Frontend** — Vercel
* **Backend + ML Service** — Railway
* **Database** — MongoDB Atlas

---

# Installation

## Prerequisites
* Node.js >= 18
* Python >= 3.9
* MongoDB Atlas account
* Resend account (free tier at resend.com)

## 1 — Clone the repository
```bash
git clone https://github.com/fatimarana456/MediTrack.git
cd MediTrack
```

## 2 — Server setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
ML_SERVICE_URL=http://localhost:8000
RESEND_API_KEY=your_resend_api_key
```

## 3 — ML Microservice setup
```bash
cd server/ml
pip install -r requirements.txt
```

> Place `heart_model.pkl` and `scaler.pkl` inside `server/ml/`

## 4 — Client setup
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## 5 — Run locally (3 terminals)

**Terminal 1 — ML microservice:**
```bash
cd server/ml
python heart_service.py
```

**Terminal 2 — Node server:**
```bash
cd server
npm run dev
```

**Terminal 3 — React client:**
```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

# Future Enhancements
* Push notifications via mobile browser
* Doctor portal for prescription management and patient oversight
* Caregiver email alerts when a patient misses a dose
* Integration with wearable health devices for automatic vitals input
* Expanded ML models for diabetes, hypertension, and other chronic disease risk
* Multi-language support

---

# Academic Integrity

This project is developed for **academic and educational purposes**.
The system demonstrates the design and development of a **full-stack healthcare application** integrating modern web technologies, a RESTful API following hexagonal architecture, and a machine learning microservice for clinical risk assessment.
