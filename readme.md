# Wealth Management Platform

## Project Summary

This project involves the development of an **online wealth management platform** that allows users to securely manage their **assets, debts, insurances, utilities, and transitions** in one centralized system.

Users can sign up, choose subscription plans, make payments, and manage their financial footprint. An **Admin Panel** is provided to manage users, CMS content, subscriptions, FAQs, blogs, and support queries.

The system supports **two roles**:

* **Users** – End customers managing their wealth
* **Admin** – Back-office users managing the platform

---

## Technology Stack


### Backend (Admin & APIs)

* Node.js
* Express.js

### Database

* MongoDB

### Other Tools & Services

* RazorPay – Payment Gateway
* Render – Deployment

---

## Features Overview

### Common Website Pages

* Landing Page
* About Us
* Blogs (List & Details)
* FAQs
* Support
* CMS Pages (Privacy Policy, Terms & Conditions, Data Policy)

### User Features

* User Registration & Login
* Email Verification & Forgot Password
* Subscription & Payment
* User Dashboard
* Asset Management
* Debt Management
* Insurance Management
* Utilities Management
* Transition (Executors & Beneficiaries)
* Profile Management

### Admin Features

* Admin Authentication
* Dashboard Analytics
* User Management
* CMS Management
* FAQ Management
* Blog Management
* Subscription Management
* Support Management

---

## User Modules (Website)

### Authentication

* Sign Up with Email Verification
* Login
* Forgot Password

### Subscription

* View Subscription Plans
* Secure Payment via RazorPay

### Dashboard

* Assets
* Debts
* Insurances
* Utilities
* Transition

### Profile

* Update Profile
* Change Password
* Help & Support
* Logout

---

## Admin Modules

### Dashboard

* Total Users
* Total Organizations
* Total Queries

### Management Modules

* User Management
* CMS Management
* FAQ Management
* Blog Management
* Subscription Management
* Support Management

---

## Project Installation Guide

### Prerequisites

Make sure you have the following installed:

* Node.js (v18+ recommended)
* MongoDB (Local or Atlas)
* EJs
* Git

---

## Backend Installation (Node.js)

```bash
# Clone the repository
git clone <repository-url>

# Navigate to backend folder
cd backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the backend root directory:

```env
PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Run Backend Server

```bash
npm run dev
```

Backend will run at:

```
http://localhost:7000
```

---

# Install dependencies
npm install
```

---

## Database Setup

* Use MongoDB locally or MongoDB Atlas
* Update `MONGO_URI` in `.env`
* Collections will be created automatically

---

## Folder Structure (Backend)

```
backend/
│── app/
│   ├── modules/
│   │   ├── user/
│   │   ├── admin/
│   │   ├── blog/
│   │   ├── faq/
│   │   ├── subscription/
│   │   └── support/
│   ├── middlewares/
│   ├── utils/
│── routes/
│── config/
│── app.js
│── server.js
```

---

## Security & Best Practices

* Passwords hashed using bcrypt
* Role-based access control
* Secure payment handling via Stripe
* Input validation & error handling

---

## Future Enhancements

* Mobile App (iOS / Android)
* Advanced Analytics Dashboard
* Multi-language Support
* Two-Factor Authentication (2FA)

---

## Author

**Tanmay Karmakar**

---

## License

This project is proprietary and developed for client use only.
