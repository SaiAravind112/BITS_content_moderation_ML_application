// backend/src/models/contentModerationModel.js

const mongoose = require('mongoose');

const ContentModerationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  contentModerationResult: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  expectedResult: {
    type: mongoose.Schema.Types.Mixed,
  },
  feedbackGiven: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ContentModerationModel = mongoose.model('ContentModeration', ContentModerationSchema);
module.exports = ContentModerationModel;