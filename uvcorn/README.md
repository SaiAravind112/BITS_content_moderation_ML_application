# Uvcorn Server

This directory contains the FastAPI server for the Content Moderation App.

## Getting Started

To run the FastAPI server, follow these steps:

1. **Install Dependencies**: Ensure you have Python installed. Install the required dependencies using pip:
    ```sh
    pip install fastapi uvicorn joblib pydantic
    ```

2. **Run the Server**: Start the FastAPI server using Uvicorn:
    ```sh
    uvicorn app:app --host 0.0.0.0 --port 3334
    ```

3. **Access the API**: The server will start running on `http://localhost:8000`. You can access the API documentation at `http://localhost:8000/docs`.

## API Endpoints

- `POST /predict/`: Predicts whether the input text is appropriate or inappropriate.

## Dependencies

The FastAPI server has the following dependencies:
- FastAPI: A modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints.
- Uvicorn: A lightning-fast ASGI server implementation, using `uvloop` and `httptools`.
- Joblib: A set of tools to provide lightweight pipelining in Python.
- Pydantic: Data validation and settings management using Python type annotations.

## Model

The server uses a pre-trained model stored in `best_model_grid_search.pkl`. Ensure this file is present in the `uvcorn` directory before starting the server.

## Example Request

To test the prediction endpoint, you can use the following example request:

```sh
curl -X POST "http://localhost:8000/predict/" -H "Content-Type: application/json" -d '{"text": "example text"}'