const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const ContentModerationModel = require('../models/contentModerationModel');

class ModerationController {
  async analyseContent(body) {
    // Analyze the input text and return the moderation result
    const { text, version } = body;
    console.log(`********${version} API Called`);
    let path;
    if(version === 'v2'){
      path = 'http://localhost:3334/v2/predict/';
    } else {
      path = 'http://localhost:3334/predict/';
    }
    const predictionResponse = await axios.post(path, { text });
    const moderationResult = predictionResponse.data;

    let cmObj = {
      text,
      contentModerationResult: moderationResult,
      version
    };

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
      const updateObj = { status };
      if(status === "APPROVED"){
        updateObj.reTrain = true;
      }

      // Find the document by ID and update it with the new status
      const updatedEntry = await ContentModerationModel.findByIdAndUpdate(
        entryId,
        updateObj,
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

  
  async updateFeedback(body) {
    try {
      const { entryId, feedback } = body;
      // Find the entry by ID and update the feedback fields
      const updatedEntry = await ContentModerationModel.findByIdAndUpdate(
        entryId,
        {
          feedbackGiven: true,
          expectedResult: { text: feedback },
          status: "PENDING"
        },
        { new: true }
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

  async exportRetrainEntries(body) {
    try {
      // const { version = "v1" } = body;
      // Fetch entries with feedbackGiven as true and status as APPROVED
      const entries = await ContentModerationModel.find({
        feedbackGiven: true,
        status: 'APPROVED',
        // version
      });
  
      // Define the CSV file path
      const filePath = path.join(__dirname, '../../../temp/retrain_entries.csv');
  
      // Define the CSV writer with headers
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'text', title: 'Text' },
          { id: 'inappropriate', title: 'inappropriate' },
          { id: 'feedbackText', title: 'Feedback Text' },
          { id: 'version', title: 'Version' },
        ],
      });
  
      // Map entries to CSV data
      const csvData = entries.map((entry) => {
        let obj = {
          text: entry.text,
          feedbackText: entry.expectedResult?.text || '',
          version: entry.version,
        };
        if(entry.contentModerationResult.moderationStatus == "APPROPRIATE"){
          obj.inappropriate = 1;
        } else {
          obj.inappropriate = 0;
        }
        return obj;
      });
  
      // Write data to CSV
      await csvWriter.writeRecords(csvData);
  
      // Send success response
      return { message: 'CSV file created successfully', filePath };
    } catch (error) {
      console.error('Error exporting retrain entries:', error);
      throw error;
    }
  }
}

module.exports = ModerationController;