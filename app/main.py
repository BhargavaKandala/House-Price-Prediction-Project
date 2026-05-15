from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# 1. Define the allowed origins (your frontend URL)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# 2. Add the CORS middleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

model = joblib.load("model.pkl")

class HouseInput(BaseModel):
    area: float
    bedrooms: int

@app.get("/")
def home():
    return {"message": "House Price Predictor API"}

@app.post("/predict")
def predict(data: HouseInput):
    features = np.array([[data.area, data.bedrooms]])
    prediction = model.predict(features)
    return {
        "predicted_price": float(prediction[0])
    }