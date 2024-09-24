const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const setModerationRoutes = require('./routes/moderationRoutes');

const corsOptions = {
  origin: 'http://localhost:3000', // Allow only this origin
  optionsSuccessStatus: 200,
};

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());

// Import models
require('./models/contentModerationModel');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/content-moderation';

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));



// Set up moderation routes
setModerationRoutes(app);

// Start the server
const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});