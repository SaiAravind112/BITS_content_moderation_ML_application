# Content Moderation App
The Content Moderation App is a web application designed to analyze and moderate user-generated content. The application consists of a frontend built with React and a backend built with Node.js and Express, connected to a MongoDB database. Additionally, a FastAPI server is used for content moderation predictions using machine learning models. This document provides an in-depth explanation of the project's structure, modules, and functionalities.

Content moderation is crucial for maintaining the quality and safety of user-generated content on online platforms. This application aims to automate the moderation process using machine learning models. The system is divided into three main components: the frontend, the backend, and the FastAPI server.

## Running the Content Moderation App Locally

### Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v14 or later)
- npm (v6 or later)
- Python (v3.6 or later)
- Docker (optional, for containerized deployment)

### Step-by-Step Instructions

#### 1. Clone the Repository
First, clone the repository to your local machine:
```sh
git clone <repository-url>
cd content-moderation-app
```

#### 2. Install Backend Dependencies
Navigate to the  `backend` directory and install the dependencies:
```sh
cd backend
npm install
```

#### 3. Install Frontend Dependencies
Navigate to the `frontend` directory and install the dependencies:
```sh
cd ../frontend
npm install
```

#### 4. Install FastAPI Server Dependencies
Navigate to the `uvcorn` directory and install the dependencies:
```sh
cd ../uvcorn
pip install -r requirements.txt
```

#### 5. Start the MongoDB Server
Ensure MongoDB is running on your machine. If you have Docker installed, you can start a MongoDB container using the following command:
```sh
docker run -d -p 27017:27017 --name mongodb mongo
```
#### 6. Start the Backend Server
Navigate to the `backend` directory and start the backend server:
```sh
cd ../backend
npm start
```

#### 7. Start the Frontend Server
Navigate to the `frontend` directory and start the frontend server:
```sh
cd ../frontend
npm start
```

#### 8. Start the FastAPI Server
Navigate to the `uvcorn` directory and start the FastAPI server:
```sh
cd ../uvcorn
uvicorn app:app --host 0.0.0.0 --port 3334
```

#### 9. Access the Application
Open your browser and navigate to http://localhost:3000 to view the Content Moderation App.


## Using Docker (Optional)
If you prefer to use Docker, you can start the entire application using Docker Compose.

### 1. Build and Start the Containers
From the root directory of the project, run the following command:
```sh
docker-compose up --build
```

### 2. Access the Application
Open your browser and navigate to http://localhost:3000 to view the Content Moderation App.


## Project Structure

```
content-moderation-app
├── .vscode/
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
├── backend/
│   ├── .eslintrc.json
│   ├── Dockerfile
│   ├── package.json
│   ├── README.md
│   └── src/
│       ├── controllers/
│       │   └── moderationController.js
│       ├── models/
│       │   └── contentModerationModel.js
│       ├── routes/
│       │   └── moderationRoutes.js
│       └── server.js
├── docker-compose.yml
├── frontend/
│   ├── .env
│   ├── .eslintrc.json
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── README.md
│   └── src/
│       ├── App.css
│       ├── App.js
│       ├── components/
│       │   ├── AdminPage.js
│       │   └── HomePage.js
│       ├── config.js
│       └── index.js
├── package.json
├── README.md
└── uvcorn/
    ├── __pycache__/
    ├── app.py
    ├── best_model_grid_search.pkl
    ├── README.md
    ├── root.py
    └── routes.py

For more information, please refer to the individual README files in the `backend` and `frontend` directories.
```

## Backend

The backend is built with Node.js and Express. It provides an API for content moderation. The backend files are located in the `backend` directory.

### Controllers

- `backend/src/controllers/moderationController.js`: This file exports a controller class `ModerationController` which handles the logic for moderating content. It contains a method `analyseContent` that analyzes the input text and returns the moderation result.

### Routes

- `backend/src/routes/moderationRoutes.js`: This file exports a function `setModerationRoutes` which sets up the routes for the moderation API. It uses the `ModerationController` to handle the `/ug-content/analyse` route.

### Models

- `backend/src/models/moderationModel.js`: This file exports a model class `ModerationModel` which represents the data structure for storing the moderation history in the MongoDB database.

### App

- `backend/src/app.js`: This file is the entry point of the backend application. It creates an instance of the Express app, sets up middleware, and registers the moderation routes.

### Server

- `backend/src/server.js`: This file starts the backend server and listens for incoming requests.

### Configuration

- `backend/package.json`: This file is the configuration file for npm. It lists the dependencies and scripts for the backend.

### Documentation

- `backend/README.md`: This file contains the documentation for the backend.

## Frontend

The frontend is built with React.js. It provides a user interface for submitting content for moderation and viewing the moderation results. The frontend files are located in the `frontend` directory.

### Components

- `frontend/src/components/AdminPage.js`: This file exports a React component `AdminPage` which displays the admin page. It includes the functionality to view user inputted texts with pagination and send them for feedback.

- `frontend/src/components/HomePage.js`: This file exports a React component `HomePage` which displays the home page. It includes a text area, a submit button, and the output of the moderation analysis.

### App

- `frontend/src/App.js`: This file is the main component of the React app. It sets up the routing for the different pages.

### Entry Point

- `frontend/src/index.js`: This file is the entry point of the frontend application. It renders the `App` component into the root DOM element.

### Styling

- `frontend/src/App.css`: This file contains the CSS styles for the frontend application.

### Configuration

- `frontend/package.json`: This file is the configuration file for npm. It lists the dependencies and scripts for the frontend.

### Documentation

- `frontend/README.md`: This file contains the documentation for the frontend.

## Docker Compose

The project includes a Docker Compose configuration file `docker-compose.yml` that defines the services for the Node.js backend and React.js frontend. It allows you to start both servers using Docker.
