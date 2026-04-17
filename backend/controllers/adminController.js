import User from '../models/User.js';
import Analysis from '../models/Analysis.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();
    
    // Additional metrics
    const recentAnalyses = await Analysis.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

    res.json({
      totalUsers,
      totalAnalyses,
      recentAnalyses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    await Analysis.deleteMany({ userId: user._id }); // cascade delete analyses
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findByIdAndDelete(req.params.id);
    if (!analysis) return res.status(404).json({ message: 'Analysis not found' });
    res.json({ message: 'Analysis removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
