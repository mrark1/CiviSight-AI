# CiviSight AI
## AI-Powered Civic Infrastructure Monitoring & Predictive Maintenance Platform

CiviSight AI is a B.Tech 3rd-year CSE/AI-ML project that lets citizens report civic infrastructure problems using images and location data. The platform analyzes uploaded images, estimates issue severity, detects probable duplicate reports, generates a formal complaint, and provides an authority dashboard for assignment, status tracking, analytics, and resolution verification.

### Core capabilities
- Citizen registration/login
- Civic issue reporting with image upload and GPS coordinates
- AI-assisted image analysis
- Issue classification: pothole, garbage, road damage, streetlight, water leakage, fallen tree, other
- Severity scoring: Low / Medium / High / Critical
- Duplicate-report similarity using image fingerprints
- AI-style formal complaint generation
- Authority dashboard
- Assignment and status workflow
- Before/after resolution verification
- Analytics and issue heatmap-ready data
- REST API
- SQLite database for zero-configuration local development
- Optional OpenAI/Gemini integration point
- Optional YOLO integration point
- Full project documentation

## Run

### Backend
Requires Python 3.10+.

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Backend: http://127.0.0.1:8000

### Frontend
The frontend is a Vite React application.

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

The frontend automatically talks to `http://127.0.0.1:8000`.

### Demo accounts
- Citizen: `citizen@civisight.local` / `demo123`
- Authority: `admin@civisight.local` / `admin123`

## Optional AI integrations

The project is deliberately runnable without paid APIs. The local analysis engine provides deterministic image/metadata-based scoring and a clean adapter interface for replacing it with YOLO/Gemini/OpenAI later.

For YOLO:
```bash
pip install ultralytics
```
Then set:
```text
ENABLE_YOLO=true
YOLO_MODEL=yolo11n.pt
```

For an LLM provider, add the provider key and implement the adapter in:
`backend/services/ai_service.py`

## Project structure

```text
CiviSight_AI/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── database.py
│   ├── models.py
│   ├── seed.py
│   ├── routes/
│   └── services/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── docs/
│   ├── PROJECT_REPORT.md
│   ├── API.md
│   └── VIVA.md
├── uploads/
└── README.md
```

## Academic positioning

Suggested title:
**"CiviSight AI: An AI-Assisted Multimodal Platform for Civic Infrastructure Monitoring, Prioritization and Predictive Maintenance"**

This project can be extended into a research prototype by evaluating classification accuracy, severity prediction, duplicate detection precision, complaint resolution time, and predictive-maintenance performance on a labeled local dataset.
