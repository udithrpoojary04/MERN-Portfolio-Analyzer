import Analysis from '../models/Analysis.js';

// ── Helper: Fetch detailed GitHub profile data ──
const fetchGitHubData = async (username) => {
  const trimmed = username.trim();
  const headers = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'AI-Portfolio-Analyzer' };

  // 1) User profile
  const userRes = await fetch(`https://api.github.com/users/${trimmed}`, { headers });
  if (!userRes.ok) throw new Error(`GitHub user "${trimmed}" not found`);
  const user = await userRes.json();

  // 2) Public repos (sorted by most recently pushed, up to 30)
  const reposRes = await fetch(`https://api.github.com/users/${trimmed}/repos?sort=pushed&per_page=30&type=owner`, { headers });
  const repos = reposRes.ok ? await reposRes.json() : [];

  // 3) Recent events (last 30 events – commits, PRs, issues, etc.)
  const eventsRes = await fetch(`https://api.github.com/users/${trimmed}/events/public?per_page=30`, { headers });
  const events = eventsRes.ok ? await eventsRes.json() : [];

  // ── Aggregate stats ──
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

  // Language breakdown
  const langMap = {};
  repos.forEach(r => {
    if (r.language) {
      langMap[r.language] = (langMap[r.language] || 0) + 1;
    }
  });
  const languages = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => `${lang} (${count} repos)`);

  // Top 8 repos by stars
  const topRepos = [...repos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 8)
    .map(r => ({
      name: r.name,
      description: r.description || 'No description',
      language: r.language || 'N/A',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      topics: (r.topics || []).join(', ') || 'none',
      updatedAt: r.pushed_at
    }));

  // Recent activity summary
  const recentPushes = events.filter(e => e.type === 'PushEvent').length;
  const recentPRs = events.filter(e => e.type === 'PullRequestEvent').length;
  const recentIssues = events.filter(e => e.type === 'IssuesEvent').length;

  // Account age
  const createdDate = new Date(user.created_at);
  const ageYears = ((Date.now() - createdDate) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  // Has README profile repo?
  const hasProfileReadme = repos.some(r => r.name?.toLowerCase() === trimmed.toLowerCase());

  return {
    username: trimmed,
    name: user.name || trimmed,
    bio: user.bio || 'No bio set',
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalStars,
    totalForks,
    languages,
    topRepos,
    recentPushes,
    recentPRs,
    recentIssues,
    accountAgeYears: ageYears,
    hasProfileReadme,
    hireable: user.hireable || false,
    blog: user.blog || 'Not set'
  };
};

// ── Main: Groq AI analysis ──
const analyzeWithGroq = async (githubUsername, portfolioUrl, resumeText = '') => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API Key is missing. Please configure it in the .env file.');
  }

  // ── Fetch rich GitHub data ──
  let gh = null;
  let githubSection = 'GitHub: Not provided';
  if (githubUsername) {
    try {
      gh = await fetchGitHubData(githubUsername);
      githubSection = `
=== VERIFIED GITHUB PROFILE DATA ===
Username: ${gh.username}
Display Name: ${gh.name}
Bio: ${gh.bio}
Account Age: ${gh.accountAgeYears} years
Hireable flag: ${gh.hireable}
Blog/Website: ${gh.blog}
Has Profile README repo: ${gh.hasProfileReadme}

--- Stats ---
Followers: ${gh.followers} | Following: ${gh.following}
Public Repos: ${gh.publicRepos}
Total Stars (across all repos): ${gh.totalStars}
Total Forks (across all repos): ${gh.totalForks}

--- Languages Used ---
${gh.languages.length > 0 ? gh.languages.join(', ') : 'None detected'}

--- Top Repositories (by stars) ---
${gh.topRepos.map((r, i) => `${i + 1}. "${r.name}" [${r.language}] ★${r.stars} 🍴${r.forks}
   Description: ${r.description}
   Topics: ${r.topics}
   Last pushed: ${r.updatedAt}`).join('\n')}

--- Recent Activity (last 30 public events) ---
Push events: ${gh.recentPushes} | Pull Requests: ${gh.recentPRs} | Issues: ${gh.recentIssues}
=== END GITHUB DATA ===`;
    } catch (err) {
      console.log('GitHub data fetch failed:', err.message);
      githubSection = `GitHub: Username "${githubUsername}" provided but could not fetch data: ${err.message}`;
    }
  }

  const prompt = `You are an expert tech recruiter and senior software engineer. You are analyzing a SPECIFIC developer's profile. Your analysis MUST be unique and personalized based on the actual data below. Generic advice is UNACCEPTABLE.

${githubSection}

Portfolio URL: ${portfolioUrl || 'Not provided'}
Resume: ${resumeText ? 'Attached' : 'Not attached'}

=== SCORING RULES ===
Base your scores on the ACTUAL data above using these criteria:

"overall" (0-100): Weighted combination of all factors. Consider:
  - Repo count & diversity (>20 repos with varied languages = higher)
  - Stars & forks received (community validation)
  - Recent activity (active in last 30 days = bonus)
  - Account age (experience over time)
  - Bio & profile completeness

"codeQuality" (0-100): Infer from:
  - Language diversity (more languages = adaptability)
  - Repo descriptions & topics (well-documented = higher quality)
  - Whether repos have READMEs, meaningful names, and non-trivial descriptions
  - Total stars as a proxy for useful code

"design" (0-100): Infer from:
  - Portfolio URL presence and quality
  - Whether repos include frontend/UI projects (React, Vue, CSS, HTML repos)
  - Profile README existence
  - Bio and profile polish

"impact" (0-100): Infer from:
  - Total stars and forks (community impact)
  - Follower count relative to account age
  - Open source contribution signals (PRs, issues)
  - Project topics and descriptions suggesting real-world use

=== SUGGESTION RULES ===
Each suggestion MUST reference the developer's SPECIFIC repos, languages, or gaps by name.
- If they use JavaScript but no TypeScript → suggest TypeScript migration for specific repo
- If repos lack descriptions → call out which repos need descriptions
- If no recent activity → mention the inactivity period
- If they have no portfolio → suggest building one with their strongest language
- If only one language → suggest diversifying with a specific complementary language
DO NOT give generic advice like "contribute to open source" or "improve code quality" without specifics.

=== JOB READINESS ===
- "Beginner": <5 repos, <2 languages, <10 followers, little activity
- "Intermediate": 5-15 repos, 2-4 languages, some stars, moderate activity
- "Advanced": 15+ repos, 4+ languages, meaningful stars/forks, consistent activity
- "Ready to Hire": 20+ repos, diverse tech stack, strong stars/forks, active contributions, portfolio present

Provide the analysis in EXACTLY this JSON format. Return ONLY valid raw JSON – no markdown, no code fences, no explanation:
{
  "scores": {
    "overall": <number 0-100>,
    "codeQuality": <number 0-100>,
    "design": <number 0-100>,
    "impact": <number 0-100>
  },
  "metrics": {
    "totalProjects": ${gh ? gh.publicRepos : 0},
    "followers": ${gh ? gh.followers : 0},
    "stars": ${gh ? gh.totalStars : 0}
  },
  "suggestionItems": [
    "<specific suggestion referencing their actual repos/languages>",
    "<specific suggestion referencing their actual repos/languages>",
    "<specific suggestion referencing their actual repos/languages>",
    "<specific suggestion referencing their actual repos/languages>"
  ],
  "jobReadiness": "<Beginner|Intermediate|Advanced|Ready to Hire>"
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
        messages: [
          { role: "system", content: "You are a precise technical recruiter AI. You ONLY return valid JSON. You personalize every analysis based on the specific developer data provided." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || 'Groq API Error');
    }

    let jsonText = data.choices[0].message.content.trim();
    // Clean markdown fencing if Llama wraps it
    const cleanJson = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
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
