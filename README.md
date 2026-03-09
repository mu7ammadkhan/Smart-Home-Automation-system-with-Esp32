# Nova Control

Nova Control is a smart home automation platform that connects a modern web dashboard with ESP32 based IoT devices.

The system allows users to control electrical devices, manage rooms and devices, and monitor device states through a web interface.

This project is currently being developed using **Next.js, MongoDB, MQTT, and ESP32 devices**.

---

# Tech Stack

Frontend
- Next.js
- React
- TypeScript / JavaScript

Backend
- Next.js API Routes
- Node.js

Database
- MongoDB

IoT Communication
- MQTT
- ESP32

Deployment
- Vercel

---

# Features

- User authentication
- Room management
- Device management
- Device control from dashboard
- Real-time communication with IoT devices
- Device state monitoring

---

# System Architecture

The system consists of four main parts:

1. Web Dashboard  
   Users control devices through a Next.js web interface.

2. Backend APIs  
   API routes handle authentication, device management, and system logic.

3. Database  
   MongoDB stores users, rooms, and device information.

4. IoT Communication  
   MQTT enables real-time communication between the web platform and ESP32 devices.

---

# Device Communication Flow

1. User sends a command from the dashboard  
2. Backend processes the request  
3. Command is published to MQTT broker  
4. ESP32 device receives the command  
5. Device performs the action (ON/OFF etc)  
6. Device publishes status update  
7. Web dashboard updates device state

---

# Running the Project Locally

Clone the repository
git clone
https://github.com/mu7ammadkhan/Smart-Home-Automation-system-with-Esp32.git

Install dependencies

Open in browser

---

# Future Improvements

- Automation rules
- AI smart Voice recognization
- Mobile application
- Offline control mode
- Device analytics

---

# Author

Muhammad Khan

LinkedIn  
https://www.linkedin.com/in/muhammad-khan-017b8829b

Fiverr  
https://www.fiverr.com/muhammad_khan67
