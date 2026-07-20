# 🌐 SocialApp – Full-Stack Social Media Platform

![Django](https://img.shields.io/badge/Django-6.0-092E20?style=flat&logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-REST_API-A30000?style=flat&logo=django&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_Storage-3448C5?style=flat&logo=cloudinary&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployment-46E3B7?style=flat&logo=render&logoColor=black)

## 📖 Project Overview

**SocialApp** is a full-stack social networking web application designed to provide users with an interactive platform to connect, share content, and engage with other users.

The application allows users to create and manage profiles, publish posts with images, like and comment on posts, follow other users, send friend requests, save posts, receive notifications, and discover users through search functionality.

The platform is built using **Django** and **Django REST Framework** for backend development, with **HTML, CSS, and JavaScript** powering the frontend experience. **Cloudinary** is integrated for persistent cloud-based media storage, while the application is deployed on **Render**.

This project was developed to gain hands-on experience with **full-stack web development, REST API development, authentication, database management, cloud media storage, frontend-backend integration, and production deployment**.

---

## 🌐 Live Demo

Experience SocialApp in action:

🔗 **Live Application:** https://socialmedia-app-23hp.onrender.com

> **Note:** The application is hosted on Render's free tier. The server may take some time to wake up after a period of inactivity.

### Demo Features

- User Registration & Login
- User Profile Management
- Profile Picture & Cover Photo Upload
- Post Creation & Image Upload
- Like & Comment System
- Save Posts
- Follow & Unfollow Users
- Friend Request System
- Notifications
- User Search
- Dark Mode

---

## 🚀 Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Python
- Django
- Django REST Framework

### Database

- SQLite – Local Development
- PostgreSQL – Production

### Cloud Media Storage

- Cloudinary

### Deployment

- Render
- Gunicorn
- WhiteNoise

### Development Tools

- Git
- GitHub
- VS Code

---

## ✨ Core Features

### 🔐 User Authentication

#### Registration Features

- User Account Registration
- Username Validation
- Secure Password Handling
- User Profile Creation

#### Login Features

- Secure User Login
- Session-Based Authentication
- Session Management
- Secure Logout

---

## 👤 User Profile Management

### Profile Features

- Custom User Profiles
- Profile Picture Upload
- Cover Photo Upload
- Edit User Bio
- Username Display
- Profile Statistics

### Profile Statistics

- Total Posts
- Followers Count
- Following Count

### Media Storage

Profile pictures and cover photos are stored using Cloudinary, providing persistent cloud-based media storage across deployments.

---

## 📝 Posts & Content Management

### Post Features

- Create Posts
- Edit Posts
- Delete Posts
- Upload Images with Posts
- Display Post Timestamps
- Dynamic Post Rendering

Users can share text-based content and images with other users through the main social feed.

---

## ❤️ Social Interaction System

### Like System

- Like Posts
- Unlike Posts
- Dynamic Like Updates

### Comment System

- Add Comments
- View Post Comments
- Interact with Other Users

### Saved Posts

- Save Posts for Later
- Access Saved Content

---

## 👥 Follow System

### Features

- Follow Users
- Unfollow Users
- View Followers
- View Following
- Dynamic Follower Statistics

The follow system allows users to build their own social network within the platform.

---

## 🤝 Friend Request System

### Features

- Send Friend Requests
- Receive Friend Requests
- Manage Friend Requests
- Friend Request Count

Users can connect with other members through the built-in friend request system.

---

## 🔔 Notification System

### Features

- Notification Center
- Unread Notification Count
- Mark Notifications as Read
- Activity Notifications

The notification system keeps users informed about interactions and social activity.

---

## 🔍 Search & Discovery

### Features

- Search for Users
- Discover User Profiles
- View Other User Profiles
- Connect with New Users

The dynamic search functionality allows users to quickly discover and interact with other members of the platform.

---

## ☁️ Cloud Media Management

SocialApp integrates Cloudinary for persistent media storage.

### Supported Media

- Profile Pictures
- Cover Photos
- Post Images

### Benefits

- Persistent Image Storage
- Cloud-Based Media Hosting
- Production-Safe File Storage
- Media Persistence Across Render Deployments

---

## 🎨 User Experience Features

- Responsive Design
- Mobile-Friendly Interface
- Dark Mode Support
- Dynamic JavaScript Updates
- Clean Social Media Interface
- Interactive Navigation
- Real-Time UI Updates
- User-Friendly Profile Management

---

# 📸 Screenshots Documentation

## 🔐 Authentication Module

### Figure 1: Login Page

![SocialApp Login Page](screenshots/login.png)

### Figure 2: Registration Page

![SocialApp Registration Page](screenshots/register.png)

---

## 🏠 Social Feed Module

### Figure 3: Home Feed

![SocialApp Home Feed](screenshots/home-feed.png)

### Figure 4: Create Post

![SocialApp Create Post](screenshots/create-post.png)

### Figure 5: Post with Image

![SocialApp Image Post](screenshots/image-post.png)

---

## 👤 User Profile Module

### Figure 6: User Profile

![SocialApp User Profile](screenshots/profile.png)

### Figure 7: Profile Picture & Cover Photo

![SocialApp Profile Media](screenshots/profile-media.png)

### Figure 8: Edit Bio

![SocialApp Edit Bio](screenshots/edit-bio.png)

---

## ❤️ Social Interaction Module

### Figure 9: Likes & Comments

![SocialApp Likes and Comments](screenshots/likes-comments.png)

### Figure 10: Saved Posts

![SocialApp Saved Posts](screenshots/saved-posts.png)

---

## 👥 Social Connection Module

### Figure 11: User Search

![SocialApp User Search](screenshots/user-search.png)

### Figure 12: Follow System

![SocialApp Follow System](screenshots/follow-system.png)

### Figure 13: Friend Requests

![SocialApp Friend Requests](screenshots/friend-requests.png)

---

## 🔔 Notification Module

### Figure 14: Notification Center

![SocialApp Notifications](screenshots/notifications.png)

---

## 🌙 Dark Mode

### Figure 15: Dark Mode Interface

![SocialApp Dark Mode](screenshots/dark-mode.png)

---

## 📱 Mobile Responsive Views

### Figure 16: Mobile Home Feed

![SocialApp Mobile Home](screenshots/mobile-home.png)

### Figure 17: Mobile Profile

![SocialApp Mobile Profile](screenshots/mobile-profile.png)

---

## ⚙️ Installation & Setup

### Clone Repository

git clone https://github.com/PrawinKumar514/SocialApp.git

cd SocialApp

### Create Virtual Environment

python -m venv venv

### Activate Virtual Environment

#### Windows

venv\Scripts\activate

#### macOS / Linux

source venv/bin/activate

### Install Dependencies

pip install -r requirements.txt

### Apply Database Migrations

python manage.py migrate

### Run Development Server

python manage.py runserver

Application will start at:

http://127.0.0.1:8000/

---

## 🎯 Key Highlights

✅ Full-Stack Social Media Application

✅ User Authentication & Registration

✅ Secure Session Management

✅ Custom User Profiles

✅ Profile Picture Upload

✅ Cover Photo Upload

✅ Cloudinary Media Storage

✅ Bio Editing

✅ Create, Edit & Delete Posts

✅ Image Post Support

✅ Like & Unlike System

✅ Comment System

✅ Save Posts

✅ Follow & Unfollow Users

✅ Friend Request System

✅ Notification Center

✅ Unread Notification Counter

✅ User Search & Discovery

✅ Profile Statistics

✅ Dark Mode Support

✅ Responsive Design

✅ REST API Integration

✅ Cloud Deployment with Render

---

## 🎓 What I Learned

Through this project, I gained practical experience with:

- Django Web Development
- Django REST Framework
- REST API Development
- User Authentication & Authorization
- Session Management
- CRUD Operations
- Relational Database Management
- Media & File Upload Handling
- Cloudinary Cloud Storage
- Frontend-Backend Integration
- Dynamic UI Development with JavaScript
- Git & GitHub Workflows
- Production Deployment using Render

---

## 🔮 Future Enhancements

- Real-Time Chat System
- Real-Time Notifications using WebSockets
- Password Reset via Email
- Email Verification
- Google OAuth Authentication
- User Blocking & Reporting
- Hashtag System
- Trending Posts
- Advanced Content Search
- Infinite Scrolling
- Video Post Support
- Push Notifications
- Progressive Web App (PWA) Support

---

## 👨‍💻 Developer

**Prawin Kumar C**

Aspiring Full Stack Developer

🌐 Portfolio: https://prawin-portfolio-website.vercel.app/

💻 GitHub: https://github.com/PrawinKumar514

💼 LinkedIn: https://www.linkedin.com/in/prawin-kumar-974a2334b

---

⭐ If you found this project interesting, feel free to star the repository and share your feedback.

Built with Django, Django REST Framework, JavaScript, and a passion for learning full-stack development.
