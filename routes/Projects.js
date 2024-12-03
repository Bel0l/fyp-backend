const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Project = require('../models/Projects');
const ProjectRequest = require('../models/Projects'); // Assuming you have a ProjectRequest model
const User = require('../models/User');

// Student creates a new project
router.post('/', protect, authorize('student'), async (req, res) => {
  const {
    projectTitle,
    description,
    proposal,
    projectType,
    supervisor,
    program,
    groupMembers
  } = req.body;

  try {
    const student = req.user._id;

    const newProject = new Project({
      projectTitle,
      description,
      proposal,
      projectType,
      supervisor,
      program,
      groupMembers,
      student
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supervisor views all pending project requests
router.get('/requests', protect, authorize('supervisor', 'student'), async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let requests;

    if (userRole === 'student') {
      // Find projects where the logged-in student is the owner
      requests = await Project.find({ student: userId })
        .populate({
          path: 'student',
          select: 'profile.fullName profile.regNo',
      
        })
        .populate({
          path: 'supervisor',
          select: 'profile.fullName'
        });
    } else if (userRole === 'supervisor') {
      // Find projects where the logged-in supervisor is assigned
      requests = await Project.find({ supervisor: userId })
        .populate({
          path: 'student',
          select: 'profile.fullName profile.regNo'
        })
        .populate({
          path: 'supervisor',
          select: 'profile.fullName'
        });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supervisor accepts a project
router.put('/requests/:projectId/accept', protect, authorize('supervisor'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('supervisor','supervisor.fullName');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update project status to 'accepted'
    project.status = 'accepted';
    await project.save();

    res.json({ message: 'Project accepted successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific project request by ID
router.get('/requests/:id', protect,authorize('student', 'supervisor'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('student');
    if (!project) {
      return res.status(404).json({ message: 'Project request not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.put('/requests/:projectId/reject', protect, authorize('supervisor'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Optionally, notify the student about project rejection (e.g., send an email)

    // Delete the project from the database
    await Project.deleteOne({ _id: req.params.projectId });

    res.json({ message: 'Project rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/accepted', protect, authorize('supervisor'), async (req, res) => {
  try {
    const supervisorId = req.user.id;

    // Find accepted projects where the logged-in supervisor is assigned
    const acceptedProjects = await Project.find({ supervisor: supervisorId, status: 'accepted' })
      .populate({
        path: 'student',
        select: 'profile.fullName profile.regNo'
       
      })
      .populate({
        path: 'supervisor',
        select: 'profile.fullName'
      });

    res.status(200).json(acceptedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
