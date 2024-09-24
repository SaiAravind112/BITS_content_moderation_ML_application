from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import os

router = APIRouter()

model_path = 'best_model_grid_search.pkl'
if not os.path.exists(model_path):
    raise RuntimeError(f"Model file not found at {model_path}")

model = joblib.load(model_path)

# Define the request body for prediction
class TextInput(BaseModel):
    text: str

# Define the prediction route
@router.post("/predict/")
async def predict(input: TextInput):
    try:
        prediction = model.predict([input.text])
        result = "inappropriate" if prediction[0] == 1 else "appropriate"
        return {"text": input.text, "moderationStatus": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))