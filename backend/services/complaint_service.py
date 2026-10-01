def generate_complaint(issue):
    category = issue["category"]
    severity = issue["severity"]
    location = (
        f"{issue.get('latitude'):.6f}, {issue.get('longitude'):.6f}"
        if issue.get("latitude") is not None and issue.get("longitude") is not None
        else "the reported location"
    )
    action = {
        "Pothole": "inspection and road-surface repair",
        "Garbage": "immediate waste collection and area sanitation",
        "Road Damage": "technical inspection and road repair",
        "Broken Streetlight": "electrical inspection and replacement/repair",
        "Water Leakage": "pipeline inspection and leakage containment",
        "Fallen Tree": "safe removal and obstruction clearance",
        "Other": "field inspection and appropriate corrective action"
    }.get(category, "field inspection and appropriate corrective action")
    return (
        f"Subject: {severity} priority civic infrastructure complaint — {category}\\n\\n"
        f"A {category.lower()} has been reported at {location}. "
        f"The CiviSight AI assessment classifies this issue as {severity} priority "
        f"with an estimated risk score of {issue.get('score', 0):.1f}/100. "
        f"Please arrange {action} and update the civic issue record after field verification."
    )
