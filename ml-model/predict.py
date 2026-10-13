import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

IMG_SIZE = (224, 224)
MODEL_PATH = "equipment_condition_model.keras"
CLASS_NAMES_PATH = "class_names.json"

_model = None
_class_names = None

def _load():
    global _model, _class_names
    if _model is None:
        _model = tf.keras.models.load_model(MODEL_PATH)
        with open(CLASS_NAMES_PATH) as f:
            _class_names = json.load(f)
    return _model, _class_names

def _priority(condition, confidence):
    if condition != "damaged":
        return "None"
    return "High" if confidence >= 85 else "Medium"

def predict_image(img_path):
    model, class_names = _load()

    img = image.load_img(img_path, target_size=IMG_SIZE)
    arr = image.img_to_array(img)
    arr = np.expand_dims(arr, axis=0)

    preds = model.predict(arr, verbose=0)[0]
    top_idx = int(np.argmax(preds))
    confidence = round(float(preds[top_idx]) * 100, 1)
    label = class_names[top_idx]

    parts = label.rsplit("_", 1)
    equipment = parts[0].replace("_", " ").title()
    condition_raw = parts[1] if len(parts) > 1 else "unknown"

    if confidence < 60:
        condition = "UNCERTAIN"
        priority = "Review"
        maintenance_required = False
        recommendation = "Manual inspection required."
    else:
        condition = condition_raw.upper()
        maintenance_required = condition == "DAMAGED"
        priority = _priority(condition_raw, confidence)
        recommendation = (
            "Schedule maintenance as soon as possible." if maintenance_required
            else "No action needed."
        )

    return {
        "equipment": equipment,
        "condition": condition,
        "confidence": confidence,
        "maintenance_required": maintenance_required,
        "priority": priority,
        "recommendation": recommendation,
    }

if __name__ == "__main__":
    import sys
    print(json.dumps(predict_image(sys.argv[1]), indent=2))