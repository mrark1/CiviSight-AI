from app import app
from database import db
from models import User, Issue
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    if not User.query.filter_by(email="citizen@civisight.local").first():
        db.session.add(User(name="Demo Citizen", email="citizen@civisight.local",
                            password=generate_password_hash("demo123"), role="citizen"))
    if not User.query.filter_by(email="admin@civisight.local").first():
        db.session.add(User(name="Civic Administrator", email="admin@civisight.local",
                            password=generate_password_hash("admin123"), role="authority"))
    db.session.commit()
    print("Seed complete.")
