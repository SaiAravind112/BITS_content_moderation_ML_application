from fastapi import FastAPI
from predict_v2_routes import router as predict_v2_router
from predict_routes import router as predict_router
from root import router as root_router

# Initialize FastAPI
app = FastAPI()

# Include the routers
app.include_router(predict_v2_router)
app.include_router(predict_router)
app.include_router(root_router)