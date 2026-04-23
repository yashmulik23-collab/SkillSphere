# 🌐 SkillSphere

### A Professional Skill Exchange & Freelance Collaboration Platform

---

## 🚀 Overview

**SkillSphere** is a full-stack web application designed to connect **freelancers, mentors, learners, and clients** on a single platform. It enables users to **exchange skills, offer freelance services, learn from experts, and collaborate efficiently**.

The platform combines features inspired by professional networks, freelance marketplaces, and learning platforms to deliver a **modern, scalable, and user-centric ecosystem**.

---

## ✨ Key Features

### 🔐 Authentication & Security

* User Signup & Login
* JWT-based Authentication
* Role-Based Access Control (Freelancer, Mentor, Learner, Client, Admin)
* Forgot & Reset Password

---

### 🏠 Home & Discovery

* Modern landing page with hero section
* Search bar with smart suggestions
* Featured freelancers & mentors
* Skill categories & trending skills
* Testimonials and success stories

---

### 👤 User Profile

* Profile photo & cover image
* Bio, skills, experience, and portfolio
* Resume upload & social links
* Ratings, reviews, and badges
* Availability status (online/offline)

---

### 📌 Skill Posting System

Users can create posts like:

* I Can Teach
* I Want to Learn
* Freelance Service
* Looking for Freelancer

Includes:

* Title, description, pricing
* Skill level & category
* Tags, images, attachments

---

### 🔍 Advanced Search & Filters

* Filter by category, price, rating, location
* Skill level & availability filters
* Profile & skill card listings

---

### 🤝 Smart Matching System

* Match users based on skills and interests
* Mutual skill exchange suggestions
* Match percentage calculation
* Recommended freelancers and mentors

---

### 📅 Booking & Request System

* Send, accept, reject, or cancel requests
* Schedule sessions with date & time
* Online meeting links / offline locations
* Session tracking with statuses

---

### 💬 Chat System

* Real-time one-to-one messaging
* Emoji support
* File & image sharing
* Typing indicators & seen status

---

### 📊 Dashboard

#### User Dashboard:

* Profile completion progress
* Upcoming sessions & requests
* Earnings & reviews
* Skill growth charts
* Notifications & messages

#### Admin Dashboard:

* User & platform analytics
* Manage users and posts
* Detect spam & fake accounts
* Platform growth insights

---

### ⭐ Ratings & Reviews

* Star ratings
* Feedback on communication, knowledge, professionalism
* Top-rated badges

---

### 🎮 Gamification

* Reward points system
* Badges & achievements
* Leaderboards
* “Mentor of the Month”

---

### 🔔 Notifications

* Real-time alerts for:

  * Messages
  * Requests
  * Session reminders
  * Reviews
  * Achievements

---

### 🌍 Community Forum

* Ask and answer questions
* Like, comment, and save posts
* Trending discussions
* Active user leaderboard

---

### ⚙️ Settings

* Profile & password management
* Notification preferences
* Privacy controls
* Dark/Light mode
* Account deletion

---

## 🛠️ Tech Stack

### Frontend:

* React.js
* Tailwind CSS
* Axios
* React Router
* Context API / Redux

### Backend:

* Spring Boot
* REST APIs
* Spring Security
* JWT Authentication

### Database:

* MySQL

### Other Tools:

* Swagger (API Documentation)
* Git & GitHub

---

## 📁 Project Structure

```
SkillSphere/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── dto/
│   ├── config/
│   └── application.properties
│
├── database/
│   └── schema.sql
│
└── README.md
```

---

## 🗄️ Database Entities

* User
* Role
* Skill
* Category
* Request
* Session
* Review
* Message
* Chat
* Notification
* Badge
* ForumPost
* ForumComment
* Report
* Portfolio

---

## 🔌 REST API Modules

* Auth APIs
* User/Profile APIs
* Skill/Post APIs
* Search APIs
* Matching APIs
* Booking APIs
* Chat APIs
* Review APIs
* Admin APIs

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/skillsphere.git
cd skillsphere
```

---

### 2️⃣ Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skillsphere
spring.datasource.username=root
spring.datasource.password=yourpassword
```

---

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

---

### 4️⃣ Database Setup

* Create MySQL database: `skillsphere`
* Run `schema.sql`

---

## 🌐 Deployment

### Frontend:

* Vercel / Netlify

### Backend:

* AWS / Render / Railway

### Database:

* MySQL (AWS RDS or local server)

---

## 📦 Dummy Data

The project includes sample data for:

* Users
* Skill posts
* Reviews
* Messages

This helps in testing UI and features quickly.

---

## 🎯 Future Enhancements

* Video calling integration
* AI-based recommendations
* Payment gateway integration
* Mobile application (React Native)
* Advanced analytics

---

## 🤝 Contribution

Contributions are welcome!

Steps:

1. Fork the repository
2. Create a new branch
3. Commit changes
4. Submit a pull request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

Developed by **Yash Mulik**

---

## 💡 Tagline

**“Connect with Skilled People, Learn Faster, Hire Smarter.”**

---
