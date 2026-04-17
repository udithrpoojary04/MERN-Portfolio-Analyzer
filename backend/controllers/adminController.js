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
