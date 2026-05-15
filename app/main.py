from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_pipeline = joblib.load("model.pkl")

# 2. Update the Pydantic schema to match the 6 Kaggle features
class HouseInput(BaseModel):
    GrLivArea: float
    BedroomAbvGr: int
    FullBath: int
    YearBuilt: int
    Neighborhood: str
    HouseStyle: str

@app.get("/")
def home():
    return {"message": "Advanced House Price Predictor API"}

@app.post("/predict")
def predict(data: HouseInput):
    # 3. Convert incoming JSON directly into a DataFrame
    # This is crucial because our Scikit-Learn Pipeline expects column names to match!
    input_data = pd.DataFrame([{
        "GrLivArea": data.GrLivArea,
        "BedroomAbvGr": data.BedroomAbvGr,
        "FullBath": data.FullBath,
        "YearBuilt": data.YearBuilt,
        "Neighborhood": data.Neighborhood,
        "HouseStyle": data.HouseStyle
    }])
    
    # 4. Make a prediction using the pipeline
    prediction = model_pipeline.predict(input_data)

    return {
        "predicted_price": float(prediction[0])
    }
