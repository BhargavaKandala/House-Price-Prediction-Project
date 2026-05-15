import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression

DATA_PATH = os.path.join("data", "raw", "train.csv")

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Could not find train.csv at {DATA_PATH}. Please place it there.")

df = pd.read_csv(DATA_PATH)

numeric_features = ["GrLivArea", "BedroomAbvGr", "FullBath", "YearBuilt"]
categorical_features = ["Neighborhood", "HouseStyle"]
features = numeric_features + categorical_features
target = "SalePrice"

X = df[features]
y = df[target]

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

model_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", LinearRegression())
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Training production-grade pipeline on Kaggle data...")
model_pipeline.fit(X_train, y_train)

score = model_pipeline.score(X_test, y_test)
print(f"Model trained successfully! R^2 Validation Score: {score:.4f}")

joblib.dump(model_pipeline, "model.pkl")
print("Production pipeline saved successfully as 'model.pkl'!")