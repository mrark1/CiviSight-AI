# CiviSight AI — B.Tech 3rd Year Project Report

## 1. Title
**CiviSight AI: An AI-Assisted Multimodal Platform for Civic Infrastructure Monitoring, Prioritization and Predictive Maintenance**

## 2. Abstract
Civic infrastructure defects such as potholes, garbage accumulation, road damage, broken streetlights and water leakage affect safety and quality of life. Conventional complaint systems depend heavily on manual categorization and do not provide intelligent prioritization. CiviSight AI proposes a multimodal civic intelligence platform in which citizens submit an image and optional location/description. A computer-vision analysis layer classifies the issue, estimates confidence and produces a severity score. The system generates a formal complaint and routes it into an authority workflow where reports can be assigned, tracked and resolved. Duplicate detection reduces repeated reports, while analytics provide a data-driven view of infrastructure conditions. The architecture also supports future YOLO/LLM integration and predictive maintenance research.

## 3. Problem Statement
There is a gap between citizen observation of infrastructure problems and actionable maintenance intelligence. Reports may be incomplete, duplicated, unprioritized, or difficult to analyze at scale.

## 4. Objectives
1. Create an accessible civic issue reporting platform.
2. Apply computer vision to assist issue classification.
3. Estimate issue severity for prioritization.
4. Detect probable duplicate reports.
5. Generate structured complaints automatically.
6. Provide an authority dashboard and resolution workflow.
7. Store geo-tagged civic intelligence for analytics.
8. Provide an extensible architecture for predictive maintenance.

## 5. Novelty
- Image-first civic reporting rather than text-only complaints.
- Severity score combining AI analysis with civic context.
- Duplicate detection using image fingerprints and geo-category similarity.
- Before/after resolution verification workflow.
- Model-adapter architecture that can be upgraded to a trained YOLO model.
- Dataset and evaluation framework can be added without redesigning the platform.

## 6. System Architecture

Citizen → Web UI → REST API → Image Analysis → Issue Database → Authority Workflow → Analytics

Supporting services:
- image storage
- duplicate detector
- complaint generator
- analytics
- future ML training pipeline

## 7. Modules
### Citizen
Registration, login, image upload, GPS, report creation, status tracking.

### AI Analysis
Category inference, confidence score, risk/severity score, image statistics.

### Complaint Generation
Transforms AI findings into formal administrative language.

### Duplicate Detection
Exact image fingerprint + same-category nearby-coordinate comparison.

### Authority
Issue filtering, assignment, status changes, resolution notes.

### Analytics
Totals, critical/high counts, resolution rate, category distribution, workflow status.

## 8. Database
### User
id, name, email, password hash, role, created_at

### Issue
id, reporter_id, category, title, description, image_path, latitude, longitude, severity, confidence, score, status, department, assigned_to, duplicate_of, resolution_image, resolution_note, created_at, updated_at

## 9. Technology
Frontend: React, Vite, CSS, Lucide
Backend: Python, Flask, SQLAlchemy
Database: SQLite
AI: Python, Pillow, NumPy baseline
Deployment: Vercel/Render/Docker compatible
Future: YOLO, PostgreSQL/PostGIS, Redis, cloud object storage, LLM APIs

## 10. Research Evaluation Plan
For a final academic evaluation, prepare a labeled dataset of civic images and compare:
- Accuracy
- Precision
- Recall
- F1-score
- mAP for object detection
- MAE/RMSE for severity prediction
- Duplicate detection precision/recall
- Average complaint processing time
- Average resolution time

## 11. Future Scope
- Train a local YOLO model on Indian civic infrastructure data.
- Add road-segment risk prediction.
- Add weather and rainfall features.
- Add satellite/Street View-style temporal comparison where legally and technically available.
- Add multilingual voice reporting.
- Add SMS/WhatsApp notification adapters.
- Add PostGIS heatmaps.
- Add department-specific SLAs.
- Add immutable audit logs.
- Add federated/local model inference for privacy-sensitive deployments.

## 12. Conclusion
CiviSight AI demonstrates how computer vision, location intelligence and workflow automation can be combined into a practical civic infrastructure monitoring platform. The implementation is intentionally modular so that the baseline model can be replaced with a trained research model as the project dataset grows.
