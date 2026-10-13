import os
import uuid
from datetime import date
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

from predict import predict_image
from db import get_connection, init_db, next_id

app = Flask(__name__)
CORS(app)
init_db()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

def _allowed(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/uploads/<filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "" or not _allowed(file.filename):
        return jsonify({"error": "Invalid or missing image file"}), 400

    suffix = os.path.splitext(file.filename)[1]
    saved_filename = f"{uuid.uuid4().hex}{suffix}"
    saved_path = os.path.join(UPLOAD_FOLDER, saved_filename)
    file.save(saved_path)
    image_url = f"http://localhost:5000/uploads/{saved_filename}"

    try:
        result = predict_image(saved_path)

        conn = get_connection()
        insp_id = next_id("INS", "inspections")
        today = date.today().isoformat()
        conn.execute(
            "INSERT INTO inspections (id, equipment_id, equipment, image, prediction, confidence, inspector, date, status, recommendation) VALUES (?,?,?,?,?,?,?,?,?,?)",
            (insp_id, None, result["equipment"], image_url, result["condition"].title(),
             result["confidence"], "AI Inspection", today,
             "Pending" if result["maintenance_required"] else "Resolved",
             result.get("recommendation", ""))
        )
        conn.commit()
        conn.close()

        result["inspection_id"] = insp_id
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/equipment", methods=["GET"])
def get_equipment():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM equipment").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/inspections", methods=["GET"])
def get_inspections():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM inspections ORDER BY date DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/reports", methods=["GET"])
def get_reports():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM reports ORDER BY date DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@app.route("/reports", methods=["POST"])
def create_report():
    data = request.json
    conn = get_connection()
    rpt_id = next_id("RPT", "reports")
    today = date.today().isoformat()
    conn.execute(
        "INSERT INTO reports (id, equipment_id, equipment, location, issue, priority, date, status, condition, confidence, inspection_date, maintenance_required, recommendation, inspector) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (rpt_id, data.get("equipment_id"), data["equipment"], data.get("location", "Unspecified"),
         data.get("issue", ""), data["priority"], today, "Pending", data["condition"],
         data["confidence"], today, int(data["maintenance_required"]),
         data.get("recommendation", ""), data.get("inspector", "AI Inspection"))
    )
    conn.commit()
    conn.close()
    return jsonify({"id": rpt_id, "status": "created"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)