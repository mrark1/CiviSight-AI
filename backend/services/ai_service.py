"""
CiviSight AI local analysis adapter.

This module is intentionally dependency-light so the project runs on a normal
college laptop. It exposes a stable interface that can later be backed by YOLO,
Gemini, OpenAI, or a custom trained model.

The local engine uses image statistics + issue keywords supplied by the user.
It is a prototype baseline, NOT a production-grade defect detector.
"""
from PIL import Image
import numpy as np
import hashlib
from pathlib import Path

CATEGORIES = [
    "Pothole", "Garbage", "Road Damage", "Broken Streetlight",
    "Water Leakage", "Fallen Tree", "Other"
]

def image_features(path):
    try:
        im = Image.open(path).convert("RGB")
        im.thumbnail((256, 256))
        arr = np.asarray(im).astype(np.float32)
        brightness = float(arr.mean())
        contrast = float(arr.std())
        edges = float(np.abs(np.diff(arr, axis=0)).mean() + np.abs(np.diff(arr, axis=1)).mean())
        return {"brightness": brightness, "contrast": contrast, "edges": edges}
    except Exception:
        return {"brightness": 128.0, "contrast": 40.0, "edges": 20.0}

def classify_from_text(text):
    t = (text or "").lower()
    mapping = {
        "Pothole": ["pothole", "hole", "crater"],
        "Garbage": ["garbage", "trash", "waste", "litter", "dump"],
        "Road Damage": ["road damage", "crack", "broken road", "road"],
        "Broken Streetlight": ["streetlight", "street light", "lamp", "light pole"],
        "Water Leakage": ["water leak", "leakage", "leaking pipe", "pipe"],
        "Fallen Tree": ["fallen tree", "tree", "branch"]
    }
    for category, words in mapping.items():
        if any(w in t for w in words):
            return category
    return "Other"

def analyze_issue(image_path, user_text=""):
    category = classify_from_text(user_text)
    f = image_features(image_path)
    # Prototype scoring: image complexity plus category-specific risk.
    base = {"Pothole": 72, "Road Damage": 68, "Broken Streetlight": 62,
            "Water Leakage": 70, "Garbage": 52, "Fallen Tree": 82, "Other": 45}[category]
    score = min(100, max(0, base + (f["edges"] - 18) * 0.8 + (f["contrast"] - 35) * 0.15))
    if score >= 82: severity = "Critical"
    elif score >= 68: severity = "High"
    elif score >= 50: severity = "Medium"
    else: severity = "Low"
    confidence = min(0.98, 0.72 + min(0.24, abs(f["contrast"] - 35) / 300))
    return {
        "category": category,
        "severity": severity,
        "score": round(float(score), 1),
        "confidence": round(float(confidence), 3),
        "features": f,
        "engine": "CiviSight Local Vision Baseline"
    }

def file_fingerprint(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()
