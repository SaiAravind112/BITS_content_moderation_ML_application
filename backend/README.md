# Backend

This directory contains the backend code for the Content Moderation App.

## Project Structure

The backend code is organized as follows:

- `src/controllers/moderationController.js`: This file exports a controller class `ModerationController` which handles the logic for moderating content. It contains a method `analyseContent` that analyzes the input text and returns the moderation result.

- `src/routes/moderationRoutes.js`: This file exports a function `setModerationRoutes` which sets up the routes for the moderation API. It uses the `ModerationController` to handle the `/ug-content/analyse` route.

- `src/models/moderationModel.js`: This file exports a model class `ModerationModel` which represents the data structure for storing the moderation history in the MongoDB database.

- `src/app.js`: This file is the entry point of the backend application. It creates an instance of the Express app, sets up middleware, and registers the moderation routes.

- `src/server.js`: This file starts the backend server and listens for incoming requests.

## Getting Started

To run the backend server, follow these steps:

1. Install the dependencies by running `npm install`.
2. Start the server by running `npm start`.
3. The server will start running on `http://localhost:3000`.

## API Documentation

The backend server exposes the following API endpoints:

- `POST /ug-content/analyse`: Analyzes the input text and returns the moderation result.

## Dependencies

The backend code has the following dependencies:

- Express: Fast, unopinionated, minimalist web framework for Node.js.
- Mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
- Body-parser: Node.js body parsing middleware.

For more details, please refer to the `package.json` file.

```

Please note that this is just a template and you may need to modify it according to your specific project requirements.