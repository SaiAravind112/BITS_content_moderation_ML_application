const express = require('express');
const router = express.Router();
const ModerationController = require('../controllers/moderationController');

// Create an instance of the ModerationController
const moderationController = new ModerationController();

// moderationRoutes.js
module.exports = function setModerationRoutes(app) {
  // Define your routes here
  app.get('/moderate', (req, res) => {
    res.send('Moderation route');
  });

  app.post('/ug-content/analyse', async (req, res) => {
    try {
      const result = await moderationController.analyseContent(req.body);
      res.json(result);
    } catch (err) {
      console.error('Error while analysing text:', err);
      res.status(500).json({ error: 'Error while analysing text' });
    }
  });

  app.get('/ug-content/history', async (req, res) => {
    try {
      const result = await moderationController.fetchContentHistory(req.query);
      res.json(result);
    } catch (err) {
      console.error('Error fetching history:', err);
      res.status(500).json({ error: 'Error fetching history' });
    }
  });

  app.get('/ug-content/review', async (req, res) => {
    try {
      const result = await moderationController.fetchPendingContent(req.query);
      res.json(result);
    } catch (err) {
      console.error('Error fetching Status:Pending Content:', err);
      res.status(500).json({ error: 'Error fetching Status:Pending Content' });
    }
  });

  app.post('/ug-content/review/status', async (req, res) => {
    try {
      const result = await moderationController.reviewContentStatus(req.body);
      res.json(result);
    } catch (err) {
      console.error('Error while reviewing Content Status:', err);
      res.status(500).json({ error: 'Error while reviewing Content Status' });
    }
  });
};