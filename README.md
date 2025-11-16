# vlogs-backend
---

# **Vlogify – MERN Stack Vlog Application**

Vlogify is a full-stack vlog application built using the **MERN stack**, allowing users to upload and share two types of video content:

* **Long-form videos**
* **Short-form videos**

All uploaded videos are securely stored and delivered through **Cloudinary**.

---

## 🚀 **Features**

### 🎥 **Video Uploading**

* Upload long-form videos (vlogs, tutorials, storytelling, etc.)
* Upload short-form videos (reels/TikTok-style clips)
* Supports Cloudinary video storage and streaming URLs

### 👤 **User Authentication**

* JWT-based login & signup
* Protected routes for video upload

### 🗂️ **Video Management**

* View all videos
* Filter by short/long form
* Watch individual clips
* Delete your own uploads

### 🧱 **Tech Stack**

**Frontend:** React, Axios, React Router
**Backend:** Node.js, Express.js
**Database:** MongoDB + Mongoose
**Cloud Storage:** Cloudinary
**Auth:** JWT + bcrypt

---

## 📁 **Project Structure**

```
/client
  ├── src
  ├── components
  ├── pages
  └── utils

/server
  ├── controllers
  ├── routes
  ├── models
  ├── middleware
  └── config (Cloudinary & DB configs)
```

---

## ⚙️ **Installation & Setup**

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/vlogify.git
cd vlogify
```

### 2️⃣ Install server dependencies

```bash
cd server
npm install
```

### 3️⃣ Install client dependencies

```bash
cd ../client
npm install
```

---

## 🔑 **Environment Variables**

Create a `.env` file inside **/server** with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## ▶️ **Running the App**

### Start backend:

```bash
cd server
npm run dev
```

### Start frontend:

```bash
cd client
npm start
```

---

## ☁️ **Cloudinary Integration**

Videos are uploaded directly from the frontend to the server, then processed by Cloudinary using:

* `cloudinary.uploader.upload()`
* Storage type: `video`
* Secure playback URLs handled in the frontend

---

## 🔮 **Future Improvements**

* Likes, comments, and analytics
* User profiles and subscription system
* Categories & tags for better video discovery
* Notification system
* Mobile app version (React Native)

---

## 🤝 **Contributing**

Pull requests are welcome. For major changes, open an issue first to discuss your idea.

---

## 📄 **License**

This project is licensed under the **MIT License**.

---
