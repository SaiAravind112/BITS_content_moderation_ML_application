// routes/config.routes.js
const express = require('express');
const ModerationController = require('../controllers/moderationController');

// Create an instance of the ModerationController
const moderationController = new ModerationController();

module.exports = function setExportRoutes(app) {

    // Get current configuration settings
    app.post('/export/retrain-entries', async (req, res) => {
      try {
        const result = await moderationController.exportRetrainEntries(req.body);
        res.json(result);
      } catch (error) {
        console.error('Error creating csv file:', error);
        res.status(500).json({ error: 'Error creating csv file' });
      }
    });
}