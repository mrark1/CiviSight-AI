# Viva Preparation

## Q1. What problem does CiviSight AI solve?
It converts citizen-submitted photos of civic infrastructure problems into structured, prioritized and trackable maintenance issues.

## Q2. Where is AI used?
The current baseline uses image statistics and semantic issue keywords through a modular vision service. The same service interface can be replaced by YOLO or another trained computer-vision model.

## Q3. Why did you use a modular AI adapter?
It allows the academic prototype to run on ordinary hardware without requiring a large model download or paid API. It also keeps the production architecture extensible.

## Q4. How is severity calculated?
The prototype produces a 0–100 risk score from issue category and image-derived features, then maps the score to Low, Medium, High and Critical.

## Q5. How are duplicates detected?
The prototype first compares image SHA-256 fingerprints. It also checks same-category reports that occur within a small coordinate distance.

## Q6. What database is used?
SQLite for zero-configuration development. PostgreSQL + PostGIS is recommended for production.

## Q7. What is the main limitation?
The local baseline is not a trained civic-defect detector. A research-grade version should use a labeled dataset and evaluate YOLO/ViT models with standard metrics.

## Q8. How would you improve it?
Collect and label local Indian civic images, train a detector, add temporal image comparison, use geospatial clustering, and evaluate severity prediction quantitatively.

## Q9. Why is it useful in the real world?
It reduces manual categorization, creates structured complaints, prioritizes risk, reduces duplicate reports and gives maintenance teams an operational dashboard.

## Q10. What is the innovation?
The innovation is the combination of image-based issue detection, severity prioritization, geo-aware duplicate detection, automated complaint generation and resolution verification in one civic workflow.
