# 🏥 Aegis Health — Advanced Hospital Management System (HMS)

An enterprise-grade, production-ready Full-Stack Hospital Management System built from scratch with the **MERN Stack** (MongoDB, Express.js, React.js Vite, Node.js). 

Designed following modular MVC architecture, strict Role-Based Access Control (RBAC), secure JWT authentication, and an intuitive Tailwind CSS interface.

---

## 📑 Table of Contents
1. [Key Features & Highlights](#-key-features--highlights)
2. [4-Tier Role-Based Access Control (RBAC)](#-4-tier-role-based-access-control-rbac)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Database Models & Schemas](#-database-models--schemas)
5. [REST API Endpoints](#-rest-api-endpoints)
6. [Pre-configured Demo Credentials](#-pre-configured-demo-credentials)
7. [Installation & Execution Guide](#-installation--execution-guide)
8. [Folder Structure](#-folder-structure)

---

## ✨ Key Features & Highlights

- **4-Tier RBAC Architecture:** Dedicated, secured dashboards and permission boundaries for **Admin**, **Doctor**, **Staff / Receptionist**, and **Patient**.
- **Interactive Patient Consultation & EMR Builder:** Doctors can record patient vitals (Blood Pressure, Heart Rate, Temperature, Respiratory Rate, Weight), formulate diagnoses, prescribe medications (Dosage, Frequency, Duration, Instructions), and order lab tests.
- **Appointment Scheduling & Slot Lock:** Real-time availability slot verification prevents double-booking for the same doctor and date, with daily token numbers.
- **Reception Desk & Walk-In Intake:** Staff desk can rapidly enroll patients, record emergency contacts and insurance, and schedule immediate walk-ins.
- **Cashier & Billing Center:** Generate itemized invoices, track payments (Cash, Credit Card, Insurance, Online), and monitor outstanding hospital balances.
- **Executive Analytics:** High-level dashboards visualizing hospital throughput, patient volume, departmental doctor distribution, and financial collections.
- **Security Best Practices:** Password hashing with `bcryptjs`, tamper-proof JSON Web Tokens (`jsonwebtoken`), security HTTP headers with `helmet`, and request rate-limiting with `express-rate-limit`.

---

## 👥 4-Tier Role-Based Access Control (RBAC)

| Role | Permissions & Functional Modules |
| :--- | :--- |
| **Admin** | Manage clinical departments, register doctors and staff accounts, toggle user active/deactivated statuses, audit appointments, and review hospital-wide financial and clinical analytics. |
| **Doctor** | View today's consultation queue, author electronic medical records (EMR) and digital prescriptions, monitor patient vitals, and set weekly consulting days, fee, and time slots. |
| **Staff / Receptionist** | Enroll walk-in patients, manage appointment desks, handle patient check-in tokens, generate itemized invoices, and process cashier payment collections. |
| **Patient** | Self-register, browse clinical departments and doctors, schedule appointments with open slots, review digital prescriptions, and view medical history timeline. |

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom healthcare palette
- **Icons:** Lucide React
- **Routing:** React Router v6 (protected routes with role enforcement)
- **HTTP Client:** Axios with JWT interceptors (automatic token injection & 401 handling)
- **State Management:** React Context API (`AuthContext`)

### Backend
- **Runtime:** Node.js & Express.js (Modular MVC architecture)
- **Database:** MongoDB with Mongoose ODM (indexing, virtuals, cascade populate)
- **Authentication:** JWT Bearer tokens + bcryptjs password hashing
- **Security:** Helmet, CORS, and Express Rate Limiter
- **Database Fallback:** Embedded in-memory MongoDB support (`mongodb-memory-server`) for instantaneous zero-setup evaluation when local Mongo daemon is absent.

---

## 🗄️ Database Models & Schemas

- **`User`:** `name`, `email`, `password` (bcrypt hashed), `role` (`admin` \| `doctor` \| `staff` \| `patient`), `phone`, `avatar`, `isActive`, `timestamps`.
- **`Department`:** `name`, `description`, `headDoctor` (ref Doctor), `icon`, `image`, `isActive`, `timestamps`.
- **`Doctor`:** `userId` (ref User), `departmentId` (ref Department), `specialization`, `qualifications`, `experienceYears`, `consultationFee`, `availableDays`, `timeSlots`, `bio`, `roomNumber`, `timestamps`.
- **`Patient`:** `userId` (ref User), `dateOfBirth`, `gender`, `bloodGroup`, `address`, `emergencyContact`, `medicalHistory`, `allergies`, `insuranceProvider`, `insurancePolicyNumber`, `timestamps`.
- **`Appointment`:** `patientId` (ref Patient), `doctorId` (ref Doctor), `departmentId` (ref Department), `appointmentDate`, `timeSlot`, `status` (`Pending` \| `Confirmed` \| `Completed` \| `Cancelled`), `reasonForVisit`, `tokenNumber`, `timestamps`.
- **`MedicalRecord`:** `appointmentId` (ref Appointment), `patientId` (ref Patient), `doctorId` (ref Doctor), `diagnosis`, `symptoms`, `prescriptions` (`[{ medicine, dosage, frequency, duration, instructions }]`), `labTests`, `vitals` (`bloodPressure`, `heartRate`, `temperature`, `weight`, `respiratoryRate`), `notes`, `followUpDate`, `timestamps`.
- **`Billing`:** `patientId`, `appointmentId`, `invoiceNumber`, `items` (`[{ description, amount, quantity }]`), `subtotal`, `tax`, `discount`, `totalAmount`, `paidAmount`, `paymentStatus` (`Pending` \| `Paid` \| `Partially Paid`), `paymentMethod`, `timestamps`.

---

## 🌐 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Patient self-registration
- `POST /api/auth/login` — Sign in and issue JWT token
- `GET /api/auth/me` — Authenticated session check
- `PUT /api/auth/profile` — Update user profile

### 👥 User Management (`/api/users` - Admin)
- `GET /api/users` — Paginated list with role and search filters
- `POST /api/users` — Create Doctor, Staff, or Admin account
- `PATCH /api/users/:id/status` — Toggle user activation status
- `DELETE /api/users/:id` — Delete user and profile record

### 🏢 Departments (`/api/departments`)
- `GET /api/departments` — List active departments with doctor count
- `GET /api/departments/:id` — Department details and assigned doctors
- `POST /api/departments` — Create department (Admin)
- `PUT /api/departments/:id` — Update department (Admin)
- `DELETE /api/departments/:id` — Delete department (Admin)

### 🩺 Doctors (`/api/doctors`)
- `GET /api/doctors` — Filter by department, search by name or specialty
- `GET /api/doctors/:id` — Doctor profile details
- `GET /api/doctors/:id/availability` — Real-time slot availability for selected date
- `PUT /api/doctors/:id` — Update schedule, fee, slots (Doctor or Admin)

### 👤 Patients (`/api/patients`)
- `GET /api/patients` — List patients with search (Staff, Doctor, Admin)
- `GET /api/patients/:id` — Patient profile details
- `POST /api/patients` — Front-desk patient enrollment (Staff, Admin)
- `PUT /api/patients/:id` — Update patient profile and emergency contacts
- `GET /api/patients/:id/history` — Full medical file: visits, prescriptions, notes

### 📅 Appointments (`/api/appointments`)
- `GET /api/appointments` — Role-filtered appointment schedule
- `POST /api/appointments` — Book appointment with conflict checking
- `GET /api/appointments/:id` — View appointment details
- `PATCH /api/appointments/:id/status` — Update status (Confirmed, Completed, Cancelled)
- `PATCH /api/appointments/:id/reschedule` — Change appointment date and slot

### 📋 Medical Records / EMR (`/api/medical-records`)
- `GET /api/medical-records` — List medical records (filtered by role or patient)
- `POST /api/medical-records` — Author prescription, vitals, diagnosis (Doctor)
- `GET /api/medical-records/:id` — View single clinical record
- `PUT /api/medical-records/:id` — Update record (Doctor)

### 💳 Billing & Cashier (`/api/billing`)
- `GET /api/billing` — List invoices (Staff, Admin, or Patient self)
- `POST /api/billing` — Generate itemized patient invoice (Staff, Admin)
- `PATCH /api/billing/:id/payment` — Settle payment and record method (Staff, Admin)

### 📊 System Analytics (`/api/analytics`)
- `GET /api/analytics/overview` — Aggregated hospital KPIs, financials, department volumes

---

## 🔑 Pre-configured Demo Credentials

For quick evaluation, click the demo pill buttons on the **Login Page** or enter the credentials below:

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@hospital.com` | `Admin@123` | System oversight, User/Staff/Doctor management, Department configuration, Financial Analytics |
| **Cardiology Doctor** | `doctor.sarah@hospital.com` | `Doctor@123` | Today's patient queue, EMR consultation builder, Prescriptions, Slot availability |
| **Neurology Doctor** | `doctor.robert@hospital.com` | `Doctor@123` | Specialist queue, EMR consultation, Neurological records |
| **Front-Desk Staff** | `staff@hospital.com` | `Staff@123` | Patient check-in desk, Walk-in registration, Slot booking desk, Billing invoices |
| **Patient** | `patient.john@hospital.com` | `Patient@123` | Book consultation wizard, View digital prescriptions, Personal medical timeline |

---

## 🚀 Installation & Execution Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- Optional: Local MongoDB or MongoDB Atlas URI (if not provided, the server automatically connects to an in-memory database).

### 2. Environment Setup

#### Server Configuration (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hospital_management
USE_IN_MEMORY_DB=false
JWT_SECRET=supersecretjwtkey_hospital_system_secure_2026_xyz
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### Client Configuration (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Install All Dependencies
Run from the root directory:
```bash
npm run install:all
```
*Or install individually:*
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 4. Seed Database with Realistic Demo Data
Populate users, doctors across multiple departments, patients, appointments, EMRs, and invoices:
```bash
npm run seed
```

### 5. Launch the Application
Run both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 📂 Folder Structure

```
DMBS Project/
├── package.json              # Root concurrently scripts
├── README.md                 # Complete documentation & guide
├── server/
│   ├── .env.example          # Server environment sample
│   ├── .env                  # Server environment configuration
│   ├── package.json          # Express dependencies & scripts
│   └── src/
│       ├── config/
│       │   └── db.js         # Mongo connection with memory fallback
│       ├── models/           # Mongoose schemas
│       │   ├── User.js
│       │   ├── Department.js
│       │   ├── Doctor.js
│       │   ├── Patient.js
│       │   ├── Appointment.js
│       │   ├── MedicalRecord.js
│       │   └── Billing.js
│       ├── middleware/       # JWT auth & RBAC verification
│       │   ├── auth.middleware.js
│       │   ├── role.middleware.js
│       │   └── error.middleware.js
│       ├── controllers/      # Business logic handlers
│       │   ├── auth.controller.js
│       │   ├── user.controller.js
│       │   ├── department.controller.js
│       │   ├── doctor.controller.js
│       │   ├── patient.controller.js
│       │   ├── appointment.controller.js
│       │   ├── medicalRecord.controller.js
│       │   ├── billing.controller.js
│       │   └── analytics.controller.js
│       ├── routes/           # Express router endpoints
│       ├── utils/            # Standard response & error handlers
│       ├── seed/
│       │   └── seedData.js   # Production seed script
│       └── server.js         # Express app entrypoint
└── client/
    ├── .env.example          # Client environment template
    ├── .env                  # Client environment configuration
    ├── package.json          # React Vite dependencies
    ├── vite.config.js        # Vite config with API proxy
    ├── tailwind.config.js    # Custom styling theme
    ├── index.html            # Main HTML document
    └── src/
        ├── index.css         # Tailwind base styles
        ├── main.jsx          # React DOM entry
        ├── App.jsx           # React Router v6 routing tree
        ├── services/
        │   └── api.js        # Axios instance with interceptors
        ├── context/
        │   └── AuthContext.jsx # Authentication & RBAC state
        ├── components/       # Reusable UI elements
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── Sidebar.jsx
        │   │   ├── Header.jsx
        │   │   ├── Modal.jsx
        │   │   ├── StatCard.jsx
        │   │   ├── Badge.jsx
        │   │   └── LoadingSpinner.jsx
        │   └── ProtectedRoute.jsx
        ├── layouts/          # Role layouts (Public & Dashboard)
        └── pages/            # Role pages (Public, Admin, Doctor, Staff, Patient)
```

---

## 🔒 Security Architecture
1. **Password Hashing:** Salted SHA-256 via `bcryptjs` with work factor 10. Passwords are never returned in queries (`select: false` by default).
2. **Access Control:** Every route verifies JWT validity and matches `req.user.role` against authorized role arrays before granting access.
3. **Data Sanitization & Headers:** Protected with `helmet` against common web vulnerabilities (XSS, Clickjacking, MIME sniffing).
4. **Brute-Force Protection:** Rate limiting configured via `express-rate-limit` across all `/api` endpoints.

