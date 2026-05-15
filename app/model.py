import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression

# 1. Use a hosted production fallback URL for remote server builds
DATA_URL = "https://raw.githubusercontent.com/manan-bedi/House-Prices-Advanced-Regression-Techniques/master/data/train.csv"
LOCAL_PATH = os.path.join("data", "raw", "train.csv")

print("Loading dataset for model compilation...")
# If local dataset exists, use it; otherwise stream it via HTTPS
if os.path.exists(LOCAL_PATH):
    print("Using local train.csv file asset.")
    df = pd.read_csv(LOCAL_PATH)
else:
    print("Local file missing or on cloud server. Fetching train.csv via secure stream link...")
    df = pd.read_csv(DATA_URL)

# 2. Feature Selection
numeric_features = ["GrLivArea", "BedroomAbvGr", "FullBath", "YearBuilt"]
categorical_features = ["Neighborhood", "HouseStyle"]
features = numeric_features + categorical_features
target = "SalePrice"

X = df[features]
y = df[target]

# 3. Preprocessing Pipelines
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

# 4. Chain Pipeline
model_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", LinearRegression())
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Training production-grade pipeline...")
model_pipeline.fit(X_train, y_train)

score = model_pipeline.score(X_test, y_test)
print(f"Model trained successfully! R^2 Score: {score:.4f}")

# 5. Save the pipeline object out to the workspace root
joblib.dump(model_pipeline, "model.pkl")
print("Production pipeline saved successfully as 'model.pkl'!")