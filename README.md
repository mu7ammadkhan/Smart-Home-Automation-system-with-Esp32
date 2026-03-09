# Nova Control

Nova Control is a full-stack smart home automation platform that connects a modern web dashboard with ESP32 based IoT devices.
The platform allows users to control electrical appliances, manage rooms and devices, and monitor device states through a web interface.
Nova Control is being developed using **Next.js, MongoDB, MQTT, and ESP32 devices**.

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

# System Architecture

Nova Control consists of four main components.

1. Web Application  
   A Next.js dashboard where users control devices and manage rooms.

2. Backend APIs  
   Next.js API routes handle authentication, device management, and system logic.

3. Database  
   MongoDB stores users, rooms, devices, and device metadata.

4. IoT Communication Layer  
   MQTT enables real-time communication between the web platform and ESP32 devices.

# Diagram

User (Web Dashboard) => Next.js Web App - Frontend + APIs => API Calls =>  MongoDB | Users / Rooms / Devices / States => MQTT Publish => MQTT Broker => MQTT Subscribe => ESP32 Device => Relays / Appliances /Lights / Fans etc

# Features

User authentication
Room management
Device management
Device control from dashboard
Real-time communication with ESP32 devices
Device state monitoring
MQTT Topics Structure

# The platform uses a structured MQTT topic format for device communication.

users/{userId}/devices/{deviceId}/commands
users/{userId}/devices/{deviceId}/status
users/{userId}/devices/{deviceId}/heartbeat
users/{userId}/devices/{deviceId}/sensor-data
Topic Purpose

# commands
Backend sends control commands to ESP32 devices.

# status
ESP32 publishes the current device state.

# heartbeat
ESP32 periodically sends online status.

# Device Communication Flow

User clicks control button
        |
        v
Next.js API receives request
        |
        v
Backend publishes MQTT command
        |
        v
ESP32 receives command
        |
        v
Relay switches ON/OFF
        |
        v
ESP32 publishes status update
        |
        v
Dashboard updates device state
ESP32 Communication Example

Example command topic

users/u123/devices/dev001/commands

Example command payload

{
  "action": "toggle",
  "state": "on",
  "timestamp": "2026-03-10T18:00:00Z"
}

Example status topic

users/u123/devices/dev001/status

Example status payload

{
  "state": "on",
  "online": true,
  "timestamp": "2026-03-10T18:00:02Z"
}
Running the Project Locally

Clone the repository

git clone https://github.com/mu7ammadkhan/Smart-Home-Automation-system-with-Esp32.git

Install dependencies

# npm install

Run development server

# npm run dev

Open in browser

http://localhost:3000

## Future Improvements

Automation rules
Mobile application
Offline automation mode
Device analytics and monitoring

## Author

Muhammad Khan
Full Stack JavaScript Developer | React.js | Next.js | JavaScript | TypeScript | MongoDB | Firebase | IoT | Esp32 

# LinkedIn
https://www.linkedin.com/in/muhammad-khan-017b8829b

# Fiverr
https://www.fiverr.com/muhammad_khan67
