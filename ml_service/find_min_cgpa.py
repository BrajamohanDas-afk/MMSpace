import os
import pickle
import pandas as pd
import numpy as np
import tensorflow as tf

# Suppress TF warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

def find_threshold():
    try:
        metadata = pickle.load(open('models/scaler.pkl', 'rb'))
        scaler = metadata['scaler']
        feature_names = metadata['features']
        
        model = tf.keras.models.load_model('models/placement_ann.keras')
        print("Model and Scaler loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # Scenario 1: Average Profile
    print("\n--- Scenario 1: Average Student Profile ---")
    print("Stats: DSA=6.0, Internships=1, Backlogs=0, 10th=80%, 12th=80%")
    found1 = False
    for cgpa in np.arange(0.0, 10.1, 0.1):
        input_data = {
            'DSA_Skill': 6.0,
            'GP': round(cgpa, 1),
            'Internships': 1,
            'Active_Backlogs': 0,
            '10th_Marks': 80.0,
            '12th_Marks': 80.0
        }
        ordered_data = {f: [input_data.get(f, 0)] for f in feature_names}
        input_df = pd.DataFrame(ordered_data)
        scaled_features = scaler.transform(input_df)
        prob = model.predict(scaled_features, verbose=0)[0][0]
        
        if prob > 0.5:
            print(f"> Minimum CGPA required: {round(cgpa, 1)} (Probability: {prob:.1%})")
            found1 = True
            break
            
    if not found1:
        print("> Not placing even at 10.0 CGPA.")

    # Scenario 2: Exceptional Profile
    print("\n--- Scenario 2: Exceptional Student Profile ---")
    print("Stats: DSA=10.0, Internships=3, Backlogs=0, 10th=95%, 12th=95%")
    found2 = False
    for cgpa in np.arange(0.0, 10.1, 0.1):
        input_data = {
            'DSA_Skill': 10.0,
            'GP': round(cgpa, 1),
            'Internships': 3,
            'Active_Backlogs': 0,
            '10th_Marks': 95.0,
            '12th_Marks': 95.0
        }
        ordered_data = {f: [input_data.get(f, 0)] for f in feature_names}
        input_df = pd.DataFrame(ordered_data)
        scaled_features = scaler.transform(input_df)
        prob = model.predict(scaled_features, verbose=0)[0][0]
        
        if prob > 0.5:
            print(f"> Minimum CGPA required: {round(cgpa, 1)} (Probability: {prob:.1%})")
            found2 = True
            break
            
    if not found2:
        print("> Not placing even at 10.0 CGPA.")

    # Scenario 3: Poor Profile
    print("\n--- Scenario 3: Poor Student Profile ---")
    print("Stats: DSA=3.0, Internships=0, Backlogs=2, 10th=60%, 12th=60%")
    
    input_data = {
        'DSA_Skill': 3.0,
        'GP': 10.0,
        'Internships': 0,
        'Active_Backlogs': 2,
        '10th_Marks': 60.0,
        '12th_Marks': 60.0
    }
    ordered_data = {f: [input_data.get(f, 0)] for f in feature_names}
    input_df = pd.DataFrame(ordered_data)
    scaled_features = scaler.transform(input_df)
    prob = model.predict(scaled_features, verbose=0)[0][0]
    
    print(f"Exact Probability at 10.0 CGPA: {prob:.4f}")
    if prob > 0.5:
        print("Model predicting PLACED")
    else:
        print("Model predicting NOT PLACED")

if __name__ == "__main__":
    find_threshold()
