// routes/config.routes.js
const express = require('express');
const configController = require('../controllers/configController');

module.exports = function setModerationRoutes(app) {

    // Get current configuration settings
    app.get('/config', async (req, res) => {
      try {
        const config = await configController.getConfigSettings();
        res.json(config);
      } catch (error) {
        console.error('Error fetching config settings:', error);
        res.status(500).json({ error: 'Error fetching config settings' });
      }
    });
    
    // Update thresholds
    app.post('/config/update-thresholds', async (req, res) => {
      try {
        const config = await configController.updateThresholds(req.body);
        res.json(config);
      } catch (error) {
        console.error('Error updating thresholds:', error);
        res.status(500).json({ error: 'Error updating thresholds' });
      }
    });
    
    // Update API version
    app.post('/config/update-api-version', async (req, res) => {
      try {
        const config = await configController.updateApiVersion(req.body.apiVersion);
        res.json(config);
      } catch (error) {
        console.error('Error updating API version:', error);
        res.status(500).json({ error: 'Error updating API version' });
      }
    });
}