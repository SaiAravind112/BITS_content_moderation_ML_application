// controllers/config.controller.js
const Config = require('../models/configModel');

// Fetch the current configuration settings
async function getConfigSettings() {
  let config = await Config.findOne();
  if (!config) {
    // If no config found, create one with default values
    config = new Config();
    await config.save();
  }
  return config;
}

// Update thresholds for block, warn, and pass levels
async function updateThresholds(thresholds) {
  const { blockThreshold, warnThreshold, passThreshold } = thresholds;
  const config = await Config.findOneAndUpdate(
    {},
    { blockThreshold, warnThreshold, passThreshold },
    { new: true, upsert: true } // Create if doesn't exist
  );
  return config;
}

// Update the API version
async function updateApiVersion(apiVersion) {
  const config = await Config.findOneAndUpdate(
    {},
    { apiVersion },
    { new: true, upsert: true }
  );
  return config;
}

module.exports = {
  getConfigSettings,
  updateThresholds,
  updateApiVersion
};
