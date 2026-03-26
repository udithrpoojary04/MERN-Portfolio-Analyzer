import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  githubUsername: { type: String },
  portfolioUrl: { type: String },
  resumePath: { type: String },
  scores: {
    overall: Number,
    codeQuality: Number,
    design: Number,
    impact: Number
  },
  metrics: {
    totalProjects: Number,
    followers: Number,
    stars: Number
  },
  suggestionItems: [{ type: String }],
  jobReadiness: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Ready to Hire'] 
  },
  createdAt: { type: Date, default: Date.now }
});

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
