from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter()

# Define the root route
@router.get("/", response_class=HTMLResponse)
async def root():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Content Moderation Prediction Engine</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                text-align: center;
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #666;
            }
            .status {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 20px;
            }
            .dot {
                height: 10px;
                width: 10px;
                background-color: #4CAF50;
                border-radius: 50%;
                display: inline-block;
                margin-right: 10px;
            }
            .live-text {
                color: #4CAF50;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Content Moderation Prediction Engine</h1>
            <p>The Content Moderation Prediction Engine is running.</p>
            <div class="status">
                <span class="dot"></span>
                <span class="live-text">Live</span>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)