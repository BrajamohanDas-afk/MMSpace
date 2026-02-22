import pandas as pd
import numpy as np
import os
import pickle
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from mrmr import mrmr_classif
from sklearn.metrics import classification_report, accuracy_score

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

print("=== 1. Loading Base Data & Generating Synthetic Features ===")

# Read the 'Final' sheet which has 'GP'
file_path = 'dataset/Univeristy_Results.xls'
df = pd.read_excel(file_path, sheet_name='Final')

# Keep only relevant columns
df = df[['Roll No.', 'Name of Student', 'GP']]

# Drop rows where GP is missing
df = df.dropna(subset=['GP'])

# Convert GP to numeric, coerce errors to NaN, then drop NaNs
df['GP'] = pd.to_numeric(df['GP'], errors='coerce')
df = df.dropna(subset=['GP'])

# Convert 4.0 scale to 10.0 scale
df['GP'] = df['GP'] * 2.5

np.random.seed(42) # For reproducibility
num_students = len(df)

# Synthesize features
print(f"Synthesizing data for {num_students} students...")
df['10th_Marks'] = np.random.uniform(50, 98, num_students)
df['12th_Marks'] = np.random.uniform(50, 98, num_students)
df['Active_Backlogs'] = np.random.poisson(0.5, num_students) # Most have 0, some 1, 2...
df['Internships'] = np.random.poisson(1, num_students)       # Average 1 internship
df['Projects'] = np.random.poisson(2, num_students)          # Average 2 projects

# DSA and Communication (0 to 10 scale)
df['DSA_Skill'] = np.clip(np.random.normal(6, 2, num_students), 0, 10)
df['Communication_Skill'] = np.clip(np.random.normal(7, 1.5, num_students), 0, 10)

# Synthesize Target Label 'Placed' (0 or 1)
# Create a logical placement probability based on features
placement_score = (
    (df['GP'] / 10.0 * 3) + 
    (df['10th_Marks'] / 100 * 1) + 
    (df['12th_Marks'] / 100 * 1) + 
    (df['DSA_Skill'] / 10 * 3) + 
    (df['Communication_Skill'] / 10 * 1.5) + 
    (df['Internships'] * 1.5) + 
    (df['Projects'] * 0.5) - 
    (df['Active_Backlogs'] * 3) # Heavy penalty
)

# Normalize the score to a probability roughly between 0 and 1
prob_placed = 1 / (1 + np.exp(- (placement_score - placement_score.mean())))
df['Placed'] = np.random.binomial(1, prob_placed)

print(f"Generated dataset with {df['Placed'].sum()} placed and {len(df) - df['Placed'].sum()} not placed students.")
df.to_csv('dataset/synthetic_placement_data.csv', index=False)
print("Saved synthesized dataset to dataset/synthetic_placement_data.csv")

print("\n=== 2. Applying mRMR Feature Selection ===")
features = ['GP', '10th_Marks', '12th_Marks', 'Active_Backlogs', 'Internships', 'Projects', 'DSA_Skill', 'Communication_Skill']
X = df[features]
y = df['Placed']

# Select top 5 features using mRMR
try:
    selected_features = mrmr_classif(X=X, y=y, K=5)
    print(f"Top 5 selected features by mRMR: {selected_features}")
except Exception as e:
    print(f"mRMR error: {e}. Falling back to manual top features.")
    selected_features = ['GP', 'DSA_Skill', 'Internships', 'Active_Backlogs', '10th_Marks']

X_selected = df[selected_features]

print("\n=== 3. Training Artificial Neural Network (ANN) ===")
# Split data
X_train, X_test, y_train, y_test = train_test_split(X_selected, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Define ANN architecture
model = Sequential([
    Dense(16, activation='relu', input_shape=(len(selected_features),)),
    Dropout(0.2),
    Dense(8, activation='relu'),
    Dropout(0.2),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
print("Training model...")
history = model.fit(X_train_scaled, y_train, epochs=100, batch_size=32, validation_split=0.2, verbose=0)

# Evaluate
loss, accuracy = model.evaluate(X_test_scaled, y_test, verbose=0)
print(f"Model Test Accuracy: {accuracy*100:.2f}%")

y_pred = (model.predict(X_test_scaled) > 0.5).astype(int)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\n=== 4. Exporting Model & Scaler ===")
os.makedirs('ml_service/models', exist_ok=True)

# Save keras model
model_path = 'ml_service/models/placement_ann.keras'
model.save(model_path)
print(f"Saved model to {model_path}")

# Save scaler and feature names
metadata_path = 'ml_service/models/scaler.pkl'
with open(metadata_path, 'wb') as f:
    pickle.dump({
        'scaler': scaler,
        'features': selected_features
    }, f)
print(f"Saved scaler and metadata to {metadata_path}")
