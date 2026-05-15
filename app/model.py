import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# Load dataset
df = pd.read_csv("train.csv")

# Select simple features (keep it clean for API)
features = ["GrLivArea", "BedroomAbvGr", "FullBath"]
target = "SalePrice"

df = df[features + [target]].dropna()

X = df[features]
y = df[target]

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Pipeline (THIS is what makes it professional)
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", Ridge())
])

# Train
pipeline.fit(X_train, y_train)

# Evaluate
preds = pipeline.predict(X_test)

mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)

print(f"MAE: {mae}")
print(f"R2 Score: {r2}")

# Save model
joblib.dump(pipeline, "model.pkl")