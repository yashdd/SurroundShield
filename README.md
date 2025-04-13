# 🌍 SurroundShield – Your AI-Powered Environmental Risk Assistant

**SurroundShield** is an advanced AI-powered chatbot that offers **real-time, personalized safety insights** based on a user's **location, weather conditions, and health profile (BMI)**. Designed with a sleek UI and powered by cutting-edge AI models, it acts as a digital guardian—helping users stay ahead of environmental hazards, community risks, and natural disasters.

Built for **Chubb**’s innovation challenge, SurroundShield combines multi-source data, robust backend services, and a fine-tuned LLM (LLaMA 3.3 - 70B) to deliver **immediate, actionable, and context-aware guidance**.

---

## 🧠 Key Features

- 📍 **Location-Aware Risk Detection**  
  Detects nearby environmental and community hazards based on geolocation

- 🌤️ **Weather & Environmental Analysis**  
  Assesses real-time weather, pollution, UV levels, and natural disaster alerts

- 💪 **Health-Profile Awareness**  
  Integrates user BMI to personalize safety advice

- 💬 **AI Chatbot Assistant**  
  Fine-tuned LLaMA 3.3 (70B) model guiding users with risk responses and safety tips

- 🧾 **Prompted for Chubb Use Case**  
  Tailored to Chubb’s mission of Harnessing AI for Community Risk Awareness Prompt

---

## 🏗️ Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Frontend     | React.js, Bootstrap, HTML/CSS       |
| Backend      | Node.js, Express.js                 |
| AI/ML        | Flask API, Databricks, LLaMA 3.3 (70B) |
| Database     | MongoDB                             |
| Hosting/Infra| Databricks                          |

---

## 📸 UI Preview

> **Clean, modern, responsive UI** – optimized for desktop and mobile devices  
> https://www.youtube.com/watch?v=prmbRBFXmvA (Checkout the Project Demo)

---

## 🧪 How It Works

1. **User Input**: User enters their location and BMI while registering. Later he can ask queries to the Chatbot related to community awareness, surroundings, environmental disasters, etc  
2. **Real-Time Data Fetch**: System pulls current weather, pollution, disaster alerts  
3. **Risk Assessment**: Data is sent to Flask AI backend where the fine-tuned LLaMA 3.3 LLM evaluates the threat level  
4. **Chatbot Response**: The AI chatbot provides personalized advice or safety warnings

---



## ⚙️ Getting Started

### 🔧 Prerequisites

- Node.js & npm
- Python 3.10+
- MongoDB (local/cloud)
- Databricks Workspace
- API Keys for Weather/Pollution

### 🛠️ Installation

```bash
# Clone the repo
git clone https://github.com/yashdd/SurroundShield.git
cd SurroundShield

# Setup frontend
cd client
npm install
npm start

# Setup backend
cd ../server
npm install
npm run dev

# Start Flask AI service
cd ../ai-model
pip install -r requirements.txt
python app.py


# Fork the repo
# Create your feature branch (git checkout -b feature/AmazingFeature)
# Commit your changes (git commit -m 'Add amazing feature')
# Push to the branch (git push origin feature/AmazingFeature)
# Open a Pull Request

