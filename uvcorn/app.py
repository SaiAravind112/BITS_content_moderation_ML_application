from fastapi import FastAPI
from routes import router as predict_router
from root import router as root_router

# Initialize FastAPI
app = FastAPI()

# Include the routers
app.include_router(predict_router)
app.include_router(root_router)