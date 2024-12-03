const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'supervisor', 'student'],
    default: 'student'
  },
  profile: {
    fullName: { type: String },
    regNo: { type: String },
    batchNo: { type: String },
    section: { type: String },
    email: { type: String },
    program: { type: String },
    phoneNo: { type: String },
    batchAdvisor: { type: String },
    // Supervisor specific fields
    designation: { type: String },
    interestedArea: { type: String },
    projectType: { type: String },
    levelOfStudies: { type: String }
  },
  projects: [{
    projectTitle: { type: String },
    projectType: { type: String },
    description: { type: String },
    supervisor: { type: String },
    proposal: { type: String },
    groupMembers: [{ type: String }]
  }]
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
