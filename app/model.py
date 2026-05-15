import os
import sys
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression

# ── Configuration ──
MODEL_OUTPUT = "model.pkl"
LOCAL_PATH = os.path.join("data", "raw", "train.csv")

# ── Skip retraining if model already exists (critical for cloud deploys) ──
if os.path.exists(MODEL_OUTPUT) and "--force" not in sys.argv:
    print(f"✓ Pre-trained model found at '{MODEL_OUTPUT}'. Skipping retraining.")
    print("  (Run with --force to retrain: python app/model.py --force)")
    sys.exit(0)

# ── Load Dataset ──
print("Loading dataset for model compilation...")
if os.path.exists(LOCAL_PATH):
    print(f"Using local dataset: {LOCAL_PATH}")
    df = pd.read_csv(LOCAL_PATH)
else:
    print("ERROR: Local training data not found at", LOCAL_PATH)
    print("Please place the Kaggle 'train.csv' file in data/raw/ before training.")
    print("Download from: https://www.kaggle.com/c/house-prices-advanced-regression-techniques/data")
    sys.exit(1)

# ── Feature Selection ──
numeric_features = ["GrLivArea", "BedroomAbvGr", "FullBath", "YearBuilt"]
categorical_features = ["Neighborhood", "HouseStyle"]
features = numeric_features + categorical_features
target = "SalePrice"

X = df[features]
y = df[target]

# ── Preprocessing Pipelines ──
numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features)
    ]
)

# ── Train Pipeline ──
model_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", LinearRegression())
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Training production-grade pipeline...")
model_pipeline.fit(X_train, y_train)

score = model_pipeline.score(X_test, y_test)
print(f"Model trained successfully! R² Score: {score:.4f}")

# ── Save ──
joblib.dump(model_pipeline, MODEL_OUTPUT)
print(f"Production pipeline saved successfully as '{MODEL_OUTPUT}'!")