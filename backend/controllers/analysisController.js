import Analysis from '../models/Analysis.js';

// Groq API integration function
const analyzeWithGroq = async (githubUsername, portfolioUrl, resumeText = '') => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API Key is missing. Please configure it in the .env file.');
  }

  // Fetch actual GitHub data to ensure AI metrics are grounded in reality
  let githubContext = "Not provided";
  if (githubUsername) {
    githubContext = `Username: ${githubUsername}`;
    try {
      const ghRes = await fetch(`https://api.github.com/users/${githubUsername.trim()}`);
      if (ghRes.ok) {
        const ghData = await ghRes.json();
        githubContext += `\nVerified Real GitHub Stats: \n- Followers: ${ghData.followers}\n- Public Repos: ${ghData.public_repos}`;
      }
    } catch(err) {
      console.log('GitHub API fetch failed', err);
    }
  }

  const prompt = `You are an expert tech recruiter and senior software engineer. Analyze a candidate based on their provided links and verified metrics.
GitHub:
${githubContext}

Portfolio: ${portfolioUrl || 'Not provided'}
Resume: ${resumeText ? 'Attached' : 'Not attached'}

CRITICAL INSTRUCTION: Use the verified Real GitHub Stats EXACTLY as provided for the metrics if they are available. If GitHub was not provided, set followers and totalProjects to 0. Do NOT hallucinate metrics.

Provide an analysis exactly in the following JSON format. Do not return markdown, code blocks, or any other text. It must be valid raw JSON:
{
  "scores": {
    "overall": <number 0-100>,
    "codeQuality": <number 0-100>,
    "design": <number 0-100>,
    "impact": <number 0-100>
  },
  "metrics": {
    "totalProjects": <Use Real GitHub Public Repos if available, else 0>,
    "followers": <Use Real GitHub Followers EXACTLY if available, else 0>,
    "stars": <Estimate based on codeQuality>
  },
  "suggestionItems": [
    "<suggestion 1>",
    "<suggestion 2>",
    "<suggestion 3>",
    "<suggestion 4>"
  ],
  "jobReadiness": "Beginner"
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: prompt }],
        temperature: 0
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || 'Groq API Error');
    }

    let jsonText = data.choices[0].message.content.trim();
    // In case Llama returns markdown formatted JSON block
    const cleanJson = jsonText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error(`Failed to analyze with Groq AI: ${error.message}`);
  }
};

export const submitAnalysis = async (req, res) => {
  const { githubUsername, portfolioUrl } = req.body;
  const resumePath = req.file ? req.file.path : null;

  try {
    const aiResults = await analyzeWithGroq(githubUsername, portfolioUrl, "");
    
    const analysis = await Analysis.create({
      userId: req.user._id,
      githubUsername,
      portfolioUrl,
      resumePath,
      ...aiResults
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error("Analysis Submission Error:", error.message);
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
