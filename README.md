# 🌍 ILI-Nigeria (ILIN)

A full-stack platform designed to manage and streamline multilingual translation and interpretation workflows for **ILI Nigeria** — enabling efficient project handling, client coordination, and data management for a language service company.

---

## 🚀 Overview

**ILI-Nigeria (ILIN)** is a comprehensive **MERN stack** application that supports translation project management, interpreter coordination, and multilingual workflow automation.  
The system focuses on improving communication efficiency between administrators, translators, and clients while maintaining data accuracy and accessibility.

---

## ⚙️ Core Features

- 🔐 **User Authentication & Authorization** – Secure login, registration, and JWT-based session management.
- 🌐 **Project Management** – Create, update, and track translation or interpretation projects.
- 🗂️ **Client Dashboard** – Manage project requests, progress, and feedback.
- 💾 **File Uploads** – Integrated with **Cloudinary** for safe and optimized file storage.
- ✉️ **Email Notifications** – Powered by **Brevo (Sendinblue)** for automated email alerts.
- 📊 **Admin Controls** – Track translators, clients, and ongoing projects with detailed analytics.
- 📱 **Responsive Interface** – Designed with modern UI principles for both desktop and mobile use.

---

## 🛠️ Tech Stack

| Area                | Technologies                           |
| ------------------- | -------------------------------------- |
| **Frontend**        | React.js, Tailwind CSS, Axios          |
| **Backend**         | Node.js, Express.js                    |
| **Database**        | MongoDB, Mongoose                      |
| **Cloud & Storage** | Cloudinary                             |
| **Email Service**   | Brevo (Sendinblue)                     |
| **Version Control** | Git, GitHub                            |
| **Deployment**      | Local testing (Deployment in progress) |

---

## 📁 Folder Structure

```
ILIN/
│
├── client/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
│
├── server/               # Express backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── .env.example          # Example environment variables
├── README.md
└── package.json
```

---

## ⚙️ Environment Setup

### 1. Clone the repository

```bash
git clone https://github.com/YourGitHubUsername/ILIN.git
```

### 2. Navigate into the project directory

```bash
cd ILIN
```

### 3. Install dependencies for both client and server

```bash
cd client && npm install
cd ../server && npm install
```

### 4. Create a `.env` file in the `server` folder using the following template:

```
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
BREVO_API_KEY=your_brevo_api_key
```

### 5. Run the application

```bash
# Run backend
npm run dev
# Run frontend (in another terminal)
npm start
```

---

## 📦 Current Development Stage

Currently hosted locally for testing.  
Deployment and production build configurations are underway to ensure smooth hosting and scalability.

---

## 💡 Developer

**👨‍💻 Everbest Studios**  
_MERN Stack Developer | Architecting Scalable, Full-Stack Web Solutions_  
📧 **theeverbeststudios@gmail.com**  
🌐 [LinkedIn](https://www.linkedin.com/in/everbest-studios-198464291)  
🧠 _Driven by curiosity, built by consistency._
