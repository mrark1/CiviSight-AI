from models import Issue
from services.ai_service import file_fingerprint
from pathlib import Path

# Prototype duplicate detection:
# 1) exact image fingerprint
# 2) same category and nearby coordinates
def find_duplicate(new_issue, image_path):
    fp = file_fingerprint(image_path) if image_path else None
    for old in Issue.query.order_by(Issue.id.desc()).limit(250).all():
        if old.id == new_issue.id:
            continue
        if new_issue.category != old.category:
            continue
        if new_issue.latitude is not None and new_issue.longitude is not None and old.latitude is not None and old.longitude is not None:
            distance = ((new_issue.latitude-old.latitude)**2 + (new_issue.longitude-old.longitude)**2) ** 0.5
            if distance < 0.001:
                return old.id
        if fp and old.image_path and Path(old.image_path).exists():
            if file_fingerprint(old.image_path) == fp:
                return old.id
    return None
