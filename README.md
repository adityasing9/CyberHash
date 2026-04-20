# 🟩 CYBER HASH: Tactical Cryptography Platform

![Cyber Hash UI](https://img.shields.io/badge/Security-Advanced-39FF14?style=for-the-badge&logo=target&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Cyber Hash** is a high-performance, full-stack security platform designed for cryptographic research, visualization, and vulnerability testing. Built with a "Modern Midnight" cyberwarfare aesthetic, it provides a comprehensive suite of tools for both defensive and offensive security professionals.

## ⚡ Core Features

### 🔍 AI-Enhanced Attack Simulator (Auto-Solve)
The centerpiece of the platform. Paste any hash and let the **Hash Intelligence System** automatically detect the algorithm (MD5, SHA-family, BLAKE, bcrypt, Argon2, etc.) and launch a multi-vector dictionary attack.

### 💎 Multi-Hash Generation
Generate real-time hashes for any input string across 9 major algorithms:
- **Fast Hashes**: MD5, SHA-256, SHA-384, SHA-512, SHA-3 (256), BLAKE2, BLAKE3.
- **Secure/Slow KDFs**: bcrypt, Argon2id, scrypt.

### 📊 Algorithm Performance Benchmarking
Visualize the relative speeds of different hashing families. Understand the "time cost" of security by comparing how long it takes to process hashes, helping you choose the right balance between security and performance.

### 🧪 Argon2 Tuning Playground
Experiment with Argon2id parameters (Time Cost, Memory Cost, Parallelism) to see how they impact the resulting hash and system performance. Perfect for fine-tuning production security.

### 🛠️ Manual & Custom Wordlists
Upload custom `.txt` wordlists or use the **Inline Manual Editor** to paste words directly into the simulator for targeted cracking tests.

## 🛠️ Technology Stack

- **Frontend**: 
  - React 18+ (Vite)
  - Tailwind CSS (Matrix/Cyber theme)
  - Framer Motion (Micro-animations)
  - Recharts (Data visualization)
  - Lucide-React (Iconography)
- **Backend**: 
  - Python / Flask
  - `argon2-cffi`
  - `bcrypt`
  - `blake3`
  - `hashlib` (Standard library)
- **Deployment**: Localhost (Development Server)

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adityasing9/CyberHash.git
   cd CyberHash
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🛡️ Security Disclaimer
This tool is intended for **educational and authorized security testing purposes only**. Using Cyber Hash against targets without permission is illegal and unethical. The dictionary attack simulator is a demonstration of vulnerability, not a tool for unauthorized access.

---

*Built with passion by Cyber Hash Corporation.*
