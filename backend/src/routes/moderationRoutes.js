const express = require('express');
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

  app.post('/ug-content/feedback', async (req, res) => {
  
    try {
      const updatedEntry = await moderationController.updateFeedback(req.body);

      if (!updatedEntry) {
        return res.status(404).json({ message: 'Entry not found' });
      }
  
      res.status(200).json({ message: 'Feedback updated successfully', entry: updatedEntry });
    } catch (error) {
      console.error('Error updating feedback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};