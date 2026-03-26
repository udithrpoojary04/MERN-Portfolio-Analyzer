import Analysis from '../models/Analysis.js';

// Mock AI analysis function
const mockAnalyze = () => {
  return {
    scores: {
      overall: Math.floor(Math.random() * 20) + 80,
      codeQuality: Math.floor(Math.random() * 20) + 80,
      design: Math.floor(Math.random() * 20) + 80,
      impact: Math.floor(Math.random() * 20) + 80
    },
    metrics: {
      totalProjects: Math.floor(Math.random() * 30) + 10,
      followers: Math.floor(Math.random() * 500) + 50,
      stars: Math.floor(Math.random() * 1000) + 100
    },
    suggestionItems: [
      'Refactor repetitive code to make it more modular.',
      'Add more meaningful commit messages.',
      'Enhance mobile responsiveness of your portfolio.',
      'Include a system architecture diagram in your complex projects.'
    ],
    jobReadiness: 'Ready to Hire'
  };
};

export const submitAnalysis = async (req, res) => {
  const { githubUsername, portfolioUrl } = req.body;
  // If file upload exists, req.file will be populated by multer
  const resumePath = req.file ? req.file.path : null;

  try {
    const aiResults = mockAnalyze();
    
    const analysis = await Analysis.create({
      userId: req.user._id,
      githubUsername,
      portfolioUrl,
      resumePath,
      ...aiResults
    });

    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
