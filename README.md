# SocialApp

A full-stack social media web application built with Django, Django REST Framework, HTML, CSS, and JavaScript.

## Live Demo

https://socialmedia-app-23hp.onrender.com

## Overview

SocialApp is a social networking platform where users can create posts, interact with other users, manage their profiles, and stay connected through likes, comments, follows, friend requests, and notifications.

This project was built to gain hands-on experience with full-stack web development, REST APIs, user authentication, media handling, frontend-backend integration, and cloud deployment.

## Features

### User Authentication

* User registration and login
* Secure session management
* Logout functionality

### User Profiles

* Custom user profiles
* Profile picture upload
* Cover photo upload
* Bio editing
* Profile statistics

### Posts & Content

* Create posts
* Edit posts
* Delete posts
* Upload images with posts
* Timestamp display

### Social Features

* Like and unlike posts
* Comment on posts
* Save posts for later
* Follow and unfollow users
* Friend request system

### Notifications

* Notification center
* Unread notification count
* Mark notifications as read

### Search & Discovery

* Search for users
* Discover new profiles

### User Experience

* Responsive design
* Mobile-friendly interface
* Dark mode support
* Dynamic updates using JavaScript

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Django
* Django REST Framework

### Database

* SQLite

### Deployment & Tools

* Render
* GitHub
* Git
* VS Code

## Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd SocialApp
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Apply database migrations

```bash
python manage.py migrate
```

### 6. Run the development server

```bash
python manage.py runserver
```

### 7. Open in your browser

```text
http://127.0.0.1:8000/
```

## What I Learned

Through this project, I gained practical experience with:

* Django and Django REST Framework
* REST API development
* User authentication and authorization
* Media and file handling
* Frontend-backend integration
* Database management
* Git and GitHub workflows
* Deployment using Render

## Future Plans

* Real-time chat system
* Password reset via email
* Real-time notifications using WebSockets
* Progressive Web App (PWA) support

## Author

**Prawin Kumar C**

If you found this project interesting, feel free to star the repository and share your feedback.

Built with Django, JavaScript, and a passion for learning full-stack development.
