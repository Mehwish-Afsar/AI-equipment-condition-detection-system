# AI-Based University Equipment Condition Detection

Take a photo of university equipment (computer, chair, projector, AC). The AI classifies it as **Normal**, **Damaged** or **Uncertain**, shows a confidence score, and generates a maintenance report automatically.

## Features

- Upload an equipment photo and get an instant AI condition result
- Confidence score, priority level and maintenance recommendation
- Low-confidence predictions are flagged as **Uncertain** for manual inspection
- Automatic maintenance report generation
- Dashboard, equipment list, inspection history and maintenance reports
- Role-based views (Technician / Administrator), simulated without login

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Flask, Flask-CORS |
| AI Model | TensorFlow / Keras, MobileNetV2 (transfer learning) |
| Database | SQLite |

## Project Structure

```
university-equipment-management/
├── frontend/            React UI
├── ml-model/
│   ├── dataset/         Training images (one folder per class)
│   ├── train_model.py   Trains the model
│   ├── predict.py       Runs a prediction on one image
│   ├── app.py           Flask API
│   ├── db.py            SQLite setup
│   ├── seed_db.py       Fills the equipment table
│   └── requirements.txt
└── README.md
```

## Setup

### 1. Backend

```bash
cd ml-model
pip install -r requirements.txt
python seed_db.py
python app.py
```

The API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Retraining the Model

The training images are included in `ml-model/dataset/`, with one folder per class. To add more images, put them in the matching folder:

```
dataset/
├── computer_normal/
├── computer_damaged/
├── chair_normal/
├── chair_damaged/
├── projector_normal/
├── projector_damaged/
├── ac_normal/
└── ac_damaged/
```

Then run:

```bash
cd ml-model
python convert_dataset.py
python train_model.py
```
