const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const { protect, authorize } = require('../middleware/auth');

// POST /api/meetings
router.post('/', async (req, res) => {
  try {
    const { meetingType, time, location, date } = req.body;
    const supervisor = req.headers;

    // Create a new meeting instance
    const newMeeting = new Meeting({
      meetingType,
      time,
      location,
      date,
      supervisor, // Assuming this is the project's ID
    });

    // Save the meeting to the database
    await newMeeting.save();

    res.status(201).json({ message: 'Meeting created successfully', meeting: newMeeting });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/meetings', protect, authorize('student','supervisor'), async (req, res) => {
    try {
      // Fetch all meetings from the database
      const meetings = await Meeting.find({});
  
      // Respond with the fetched meetings
      res.json(meetings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
