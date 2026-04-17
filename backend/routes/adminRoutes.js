import express from 'express';
import { getAllUsers, getPlatformAnalytics, getAllAnalyses, deleteUser, deleteAnalysis } from '../controllers/adminController.js';
import { protect } from './analysisRoutes.js'; // reuse auth protect

const adminProtect = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const router = express.Router();

router.route('/users').get(protect, adminProtect, getAllUsers);
router.route('/users/:id').delete(protect, adminProtect, deleteUser);
router.route('/analytics').get(protect, adminProtect, getPlatformAnalytics);
router.route('/analyses').get(protect, adminProtect, getAllAnalyses);
router.route('/analyses/:id').delete(protect, adminProtect, deleteAnalysis);

export default router;
