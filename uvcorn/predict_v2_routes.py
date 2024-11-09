from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import torch
from transformers import BertForSequenceClassification, BertTokenizer

router = APIRouter()

# Load the new model and tokenizer
model = BertForSequenceClassification.from_pretrained('./saved_model')
tokenizer = BertTokenizer.from_pretrained('./saved_model')

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

# Define the request body for prediction
class TextInput(BaseModel):
    text: str

# Define the new v2 prediction route
@router.post("/v2/predict/")
async def predict_v2(input: TextInput):
    try:
        # Tokenize the input text
        inputs = tokenizer(input.text, return_tensors="pt", truncation=True, padding=True)
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        # Perform prediction
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=1)  # Calculate probabilities
            prediction = torch.argmax(probabilities, dim=1).item()
            inappropriate_probability = probabilities[0][1].item()  # Probability for class 1 (inappropriate)

        # Map the prediction to appropriate/inappropriate labels
        result = "inappropriate" if prediction == 1 else "appropriate"
        return {
            "text": input.text,
            "moderationStatus": result,
            "inappropriateProbability": inappropriate_probability
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
