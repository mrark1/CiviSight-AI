import os, uuid
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

from config import Config
from database import db
from models import User, Issue
from services.ai_service import analyze_issue
from services.complaint_service import generate_complaint
from services.duplicate_service import find_duplicate

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

with app.app_context():
    db.create_all()

ALLOWED = {"png", "jpg", "jpeg", "webp"}

def allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED

def user_json(u):
    return {"id": u.id, "name": u.name, "email": u.email, "role": u.role}

def issue_json(i):
    return {
        "id": i.id, "reporter_id": i.reporter_id, "category": i.category,
        "title": i.title, "description": i.description,
        "image_url": f"/uploads/{Path(i.image_path).name}" if i.image_path else None,
        "latitude": i.latitude, "longitude": i.longitude, "severity": i.severity,
        "confidence": i.confidence, "score": i.score, "status": i.status,
        "department": i.department, "assigned_to": i.assigned_to,
        "duplicate_of": i.duplicate_of, "resolution_note": i.resolution_note,
        "resolution_image": f"/uploads/{Path(i.resolution_image).name}" if i.resolution_image else None,
        "created_at": i.created_at.isoformat() if i.created_at else None,
        "updated_at": i.updated_at.isoformat() if i.updated_at else None
    }

@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "CiviSight AI"})

@app.post("/api/auth/register")
def register():
    data = request.get_json() or {}
    name, email, password = data.get("name"), data.get("email"), data.get("password")
    if not all([name, email, password]):
        return jsonify({"error": "Name, email and password are required"}), 400
    if User.query.filter_by(email=email.lower()).first():
        return jsonify({"error": "Email already registered"}), 409
    u = User(name=name.strip(), email=email.lower().strip(),
             password=generate_password_hash(password), role="citizen")
    db.session.add(u); db.session.commit()
    return jsonify({"user": user_json(u)}), 201

@app.post("/api/auth/login")
def login():
    data = request.get_json() or {}
    u = User.query.filter_by(email=(data.get("email") or "").lower().strip()).first()
    if not u or not check_password_hash(u.password, data.get("password", "")):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"user": user_json(u)})

@app.post("/api/issues/analyze")
def analyze():
    image = request.files.get("image")
    description = request.form.get("description", "")
    if not image or not image.filename:
        return jsonify({"error": "An image is required"}), 400
    if not allowed(image.filename):
        return jsonify({"error": "Allowed images: png, jpg, jpeg, webp"}), 400
    ext = image.filename.rsplit(".", 1)[1].lower()
    name = f"{uuid.uuid4().hex}.{ext}"
    path = Path(app.config["UPLOAD_DIR"]) / secure_filename(name)
    image.save(path)
    result = analyze_issue(str(path), description)
    result["stored_file"] = str(path)
    result["complaint"] = generate_complaint(result)
    return jsonify(result)

@app.post("/api/issues")
def create_issue():
    reporter_id = request.form.get("reporter_id", type=int)
    if not reporter_id:
        return jsonify({"error": "reporter_id is required"}), 400
    image = request.files.get("image")
    if not image or not allowed(image.filename):
        return jsonify({"error": "A valid image is required"}), 400
    ext = image.filename.rsplit(".", 1)[1].lower()
    name = f"{uuid.uuid4().hex}.{ext}"
    path = Path(app.config["UPLOAD_DIR"]) / secure_filename(name)
    image.save(path)
    description = request.form.get("description", "")
    analysis = analyze_issue(str(path), description)
    i = Issue(
        reporter_id=reporter_id,
        category=analysis["category"],
        title=request.form.get("title") or f"{analysis['category']} reported",
        description=description,
        image_path=str(path),
        latitude=request.form.get("latitude", type=float),
        longitude=request.form.get("longitude", type=float),
        severity=analysis["severity"],
        confidence=analysis["confidence"],
        score=analysis["score"],
        department=request.form.get("department") or "Municipal Operations"
    )
    db.session.add(i); db.session.commit()
    dup = find_duplicate(i, str(path))
    if dup:
        i.duplicate_of = dup
        db.session.commit()
    result = issue_json(i)
    result["complaint"] = generate_complaint(analysis)
    return jsonify(result), 201

@app.get("/api/issues")
def list_issues():
    status = request.args.get("status")
    category = request.args.get("category")
    q = Issue.query
    if status: q = q.filter_by(status=status)
    if category: q = q.filter_by(category=category)
    issues = q.order_by(Issue.created_at.desc()).all()
    return jsonify([issue_json(i) for i in issues])

@app.get("/api/issues/<int:issue_id>")
def get_issue(issue_id):
    i = Issue.query.get_or_404(issue_id)
    return jsonify(issue_json(i))

@app.patch("/api/issues/<int:issue_id>")
def update_issue(issue_id):
    i = Issue.query.get_or_404(issue_id)
    data = request.get_json() or {}
    for key in ["status", "assigned_to", "department", "resolution_note"]:
        if key in data:
            setattr(i, key, data[key])
    db.session.commit()
    return jsonify(issue_json(i))

@app.post("/api/issues/<int:issue_id>/resolve")
def resolve_issue(issue_id):
    i = Issue.query.get_or_404(issue_id)
    i.status = "Resolved"
    i.resolution_note = request.form.get("resolution_note", "Resolved after field verification.")
    image = request.files.get("resolution_image")
    if image and allowed(image.filename):
        ext = image.filename.rsplit(".", 1)[1].lower()
        name = f"resolved_{uuid.uuid4().hex}.{ext}"
        path = Path(app.config["UPLOAD_DIR"]) / secure_filename(name)
        image.save(path)
        i.resolution_image = str(path)
    db.session.commit()
    return jsonify(issue_json(i))

@app.get("/api/analytics")
def analytics():
    issues = Issue.query.all()
    total = len(issues)
    resolved = sum(i.status == "Resolved" for i in issues)
    critical = sum(i.severity == "Critical" for i in issues)
    high = sum(i.severity == "High" for i in issues)
    categories = {}
    statuses = {}
    for i in issues:
        categories[i.category] = categories.get(i.category, 0) + 1
        statuses[i.status] = statuses.get(i.status, 0) + 1
    return jsonify({
        "total": total, "resolved": resolved, "critical": critical, "high": high,
        "resolution_rate": round((resolved/total)*100, 1) if total else 0,
        "categories": categories, "statuses": statuses
    })

@app.get("/uploads/<path:filename>")
def uploads(filename):
    return send_from_directory(app.config["UPLOAD_DIR"], filename)

@app.errorhandler(413)
def too_large(_):
    return jsonify({"error": "File too large. Maximum is 10 MB."}), 413

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
