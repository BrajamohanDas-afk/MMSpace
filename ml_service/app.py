from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import pickle
import os

app = FastAPI(title="MMSpace Placement Prediction API", version="1.0.0")

# Determine paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'placement_ann.keras')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'scaler.pkl')

# Global variables to hold model and scaler
model = None
scaler = None
feature_names = None

@app.on_event("startup")
def load_assets():
    global model, scaler, feature_names
    try:
        print("Loading Model and Scaler...")
        model = load_model(MODEL_PATH)
        
        with open(SCALER_PATH, 'rb') as f:
            metadata = pickle.load(f)
            scaler = metadata['scaler']
            feature_names = metadata['features']
        print(f"Loaded successfully. Expected features: {feature_names}")
    except Exception as e:
        print(f"Error loading models on startup: {e}")

class StudentMetrics(BaseModel):
    # Features required based on mRMR selection
    # Adjusting typical types
    DSA_Skill: float
    GP: float
    Internships: int
    Active_Backlogs: int
    Tenth_Marks: float # Note: Pydantic doesn't like keys starting with a number '10th' so we map it.
    Twelfth_Marks: float

@app.post("/predict")
def predict_placement(metrics: StudentMetrics):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    try:
        # Create a dictionary matching exactly what was expected during training
        # IMPORTANT: Order MUST match `feature_names` exactly.
        input_data = {
            'DSA_Skill': metrics.DSA_Skill,
            'GP': metrics.GP,
            'Internships': metrics.Internships,
            'Active_Backlogs': metrics.Active_Backlogs,
            '10th_Marks': metrics.Tenth_Marks,
            '12th_Marks': metrics.Twelfth_Marks
        }
        
        # Convert to DataFrame to ensure columns match exactly (since scaling was fit on a DataFrame)
        # Note: We must re-order dictionary keys to match `feature_names` order.
        ordered_data = {f: [input_data.get(f, 0)] for f in feature_names}
        input_df = pd.DataFrame(ordered_data)
        
        # Scale
        scaled_features = scaler.transform(input_df)
        
        # Predict
        probability = model.predict(scaled_features)[0][0]
        placed = bool(probability > 0.5)
        
        return {
            "prediction": "Placed" if placed else "Not Placed",
            "probability": float(probability),
            "features_used": feature_names
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
