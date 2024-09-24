const mongoose = require('mongoose');
const axios = require('axios');

const ContentModerationModel = require('../models/contentModerationModel');

class ModerationController {
  async analyseContent(body) {
    // Analyze the input text and return the moderation result
    const { text } = body;

    const predictionResponse = await axios.post('http://localhost:3334/predict/', { text });
    const moderationResult = predictionResponse.data;

    let cmObj = {
      text,
      contentModerationResult: moderationResult,
    };
    if (moderationResult?.moderationStatus === "appropriate") {
      //auto approve the content if it is appropriate
      cmObj.status = "APPROVED";
    }
    // Create a new document using the ContentModerationModel
    const contentModeration = new ContentModerationModel(cmObj);

    // Save the document to the database
    await contentModeration.save();

    return moderationResult;
  }

  async fetchContentHistory(query) {
    const { page = 1, limit = 10 } = query;
    try {
      const entries = await ContentModerationModel.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();
      const count = await ContentModerationModel.countDocuments();
      const result = {
        entries,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalEntries: count,
      };
      return result;
    } catch (err) {
      console.error('Error fetching history:', err);
      throw Error('Error fetching history');
    }
  }


  async fetchPendingContent(query) {
    const { page = 1, limit = 10 } = query;
    try {
      const entries = await ContentModerationModel.find({ "status": "PENDING" })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();
      const count = await ContentModerationModel.countDocuments();
      const result = {
        entries,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalEntries: count,
      };
      return result;
    } catch (err) {
      console.error('Error fetching Pending Content:', err);
      throw Error('Error fetching Pending Content');
    }
  }

  async reviewContentStatus(body) {
    try {
      const { entryId, status } = body;
      // Find the document by ID and update it with the new status
      const updatedEntry = await ContentModerationModel.findByIdAndUpdate(
        entryId,
        { status },
        { new: true } // Return the updated document
      );

      if (!updatedEntry) {
        throw new Error('Entry not found');
      }

      return updatedEntry;
    } catch (error) {
      console.error('Error updating moderation result:', error);
      throw error;
    }
  }
}

module.exports = ModerationController;