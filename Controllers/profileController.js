const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const updatedProfile = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profile: updatedProfile } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: user.profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
