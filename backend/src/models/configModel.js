// models/config.model.js
const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  blockThreshold: {
    type: Number,
    required: true,
    default: 0.7
  },
  warnThreshold: {
    type: Number,
    required: true,
    default: 0.1
  },
  passThreshold: {
    type: Number,
    required: true,
    default: 0
  },
  apiVersion: {
    type: String,
    enum: ['v1', 'v2'],
    required: true,
    default: 'v1'
  }
}, { timestamps: true });

module.exports = mongoose.model('Config', configSchema);
