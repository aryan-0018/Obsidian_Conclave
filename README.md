## Obsidian Conclave – Private Sessions

A production-ready, highly secured, encrypted digital congregation platform tailored for the elite.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)


## Application Access

**Live Application :**  https://obsidian-conclave.vercel.app

**Backend API** :  https://obsidian-conclave-backend.onrender.com


Obsidian Conclave enables exclusive real-time video communication, granular host controls, encrypted credential management, and flawless secure global connection mapping through a modern and scalable MERN + LiveKit architecture.


## ✨ Key Features

- **Elite Video Conferencing**: Robust, low-latency, real-time global video sessions powered by the modern LiveKit Cloud WebRTC engine.
- **Secure Authentication**: Encrypted credential management, protected routing, and secure JWT-based session persistence.
- **Granular Session Control**: Host-guarded rooms ensuring a secure environment where participants are forcefully disconnected globally the exact millisecond a host terminates the session.
- **Instant Gateway**: 1-click room creation, instantaneous secure sharable link generation, and 1-click joining.
- **Modern UI/UX**: Built with React, Vite, and bespoke Tailwind CSS styling strictly enforcing a luxurious, unified "Royale Gold on Obsidian" aesthetic. 
- **Responsive Architecture**: Fully modular React component structure with real-time reactive state management.


## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3, Custom Gradient Configurations
- **State Management**: React Context API, Custom Hooks
- **Routing**: React Router DOM (v6)
- **Real-Time Video/Audio**: LiveKit Components React (`@livekit/components-react`), LiveKit Client
- **Notifications**: React Hot Toast

### Backend (Server)
- **Environment**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: Custom JWT Implementation, bcryptjs
- **LiveKit Orchestration**: LiveKit Server SDK (`livekit-server-sdk`) 
- **Validation**: express-validator
  

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or Atlas)
- LiveKit Cloud Account (API Key, API Secret, WebRTC URL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aryan-0018/Obsidian_Conclave.git
   cd Obsidian_Conclave
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../client
   npm install
   ```


## ⚙️ Environment Variables

Create a `.env` file in both the `server` and `client` directories.

**Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# LiveKit Orchestration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=your_livekit_wss_url
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_LIVEKIT_URL=your_livekit_url
```


## 🏃‍♂️ Running the Application

1. **Start the Backend:**
   ```bash
   cd server
   npm run dev
   ```
   *(Starts on port 5000 by default)*

2. **Start the Frontend:**
   ```bash
   cd client
   npm run dev
   ```

The application will be available locally.


## 📄 License

This project is licensed under the MIT License.
