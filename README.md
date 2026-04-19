# Curalink — AI Medical Research Console

Curalink is a high-performance, institutional-grade medical research assistant built on the MERN stack. Designed for clinical investigators, it provides a "Command Console" interface for real-time telemetry from peer-reviewed sources.

![Curalink Tactical Logo](frontend/public/logo.png)

## 🛡️ Investigative Intelligence
Curalink aggregates and synthesizes medical data from multiple high-authority sources:
- **PubMed (NCBI)**: Real-time search of indexed biomedical literature.
- **OpenAlex**: Global index of scholarly works and citations.
- **ClinicalTrials.gov**: Live telemetry from ongoing and completed clinical trials.
- **Groq LPU™ API**: Ultrafast generative summaries for scientific synthesis.

## 🚀 Key Features
- **Tactical UI**: A high-contrast, "Medical Alert" aesthetic (Crimson Red & Slate) designed for professional focus.
- **Intelligence Reports (PDF)**: Generate structured scientific reports from research sessions with one touch.
- **Session Telemetry**: Real-time research history with paginated navigation and secure session sharing.
- **Resilient Rendering**: Advanced recursive XML-to-String flattening for complex scientific nomenclature.
- **Mobile First**: Fully responsive "Investigation Unit" experience on all handheld devices.

## 🛠️ Technical Stack
- **Frontend**: React 18 (Vite), TailwindCSS, jsPDF, html2canvas.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Core AI**: Groq LPU Array (Llama-3).

## 📥 Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas or Local instance
- Groq API Key

### 2. Backend Configuration
```bash
cd curalink/backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Configuration
```bash
cd curalink/frontend
npm install
npm run dev
```

## 📋 Security & Compliance
- **Authentication**: Institutional JWT-based investigator verification.
- **Data Hygiene**: Pre-configured `.gitignore` protection for environment telemetry.
- **Privacy**: Localized PDF generation (client-side) ensures data remains within the investigator's terminal.

---
*Created by the Advanced Medical Intelligence Unit.*
