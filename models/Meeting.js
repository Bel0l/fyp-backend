const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  meetingType: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', MeetingSchema);
