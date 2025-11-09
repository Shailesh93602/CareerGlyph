export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    GITHUB_LOGIN: '/auth/github',
    LINKEDIN_LOGIN: '/auth/linkedin',
  },
  PROFILE: {
    ME: '/profile/me',
    BY_ID: (id: string) => `/profile/${id}`,
    BY_SLUG: (slug: string) => `/profile/slug/${slug}`,
    UPDATE: '/profile/update',
    DELETE: '/profile/delete',
    UPLOAD_AVATAR: '/profile/avatar',
    HEALTH_CHECK: '/profile/health',
    PUBLIC: (slug: string) => `/profile/public/${slug}`,
  },
  PROJECT: {
    LIST: '/project',
    BY_ID: (id: string) => `/project/${id}`,
    CREATE: '/project/create',
    UPDATE: (id: string) => `/project/${id}/update`,
    DELETE: (id: string) => `/project/${id}/delete`,
    SYNC_GITHUB: '/project/sync/github',
    TOGGLE_FEATURED: (id: string) => `/project/${id}/featured`,
  },
  AI: {
    GENERATE_SUMMARY: '/ai/generate-summary',
    ANALYZE_SKILLS: '/ai/analyze-skills',
    JOB_MATCH: '/ai/job-match',
    PROFILE_OPTIMIZATION: '/ai/profile-optimization',
    CAREER_SUGGESTIONS: '/ai/career-suggestions',
  },
  INTEGRATIONS: {
    GITHUB: {
      CONNECT: '/integrations/github/connect',
      DISCONNECT: '/integrations/github/disconnect',
      SYNC: '/integrations/github/sync',
      REPOSITORIES: '/integrations/github/repositories',
    },
    LINKEDIN: {
      CONNECT: '/integrations/linkedin/connect',
      DISCONNECT: '/integrations/linkedin/disconnect',
      SYNC: '/integrations/linkedin/sync',
      PROFILE: '/integrations/linkedin/profile',
    },
  },
  RECRUITER: {
    SEARCH: '/recruiter/search',
    CANDIDATES: '/recruiter/candidates',
    JOB_MATCHES: '/recruiter/job-matches',
    INSIGHTS: (candidateId: string) => `/recruiter/insights/${candidateId}`,
  },
} as const;

export const SKILL_CATEGORIES = {
  PROGRAMMING_LANGUAGES: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB',
  ],
  FRAMEWORKS: {
    FRONTEND: [
      'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby',
      'Astro', 'Alpine.js', 'Lit', 'Solid.js',
    ],
    BACKEND: [
      'Node.js', 'Express.js', 'NestJS', 'Fastify', 'Django', 'Flask',
      'FastAPI', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET',
    ],
    MOBILE: [
      'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Cordova',
    ],
  },
  DATABASES: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
    'Cassandra', 'Neo4j', 'InfluxDB', 'SQLite',
  ],
  CLOUD_PLATFORMS: [
    'AWS', 'Google Cloud', 'Microsoft Azure', 'Vercel', 'Netlify',
    'Digital Ocean', 'Heroku', 'Railway',
  ],
  DEVOPS_TOOLS: [
    'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'GitLab CI',
    'Terraform', 'Ansible', 'Nginx', 'Apache',
  ],
} as const;

export const PROJECT_TEMPLATES = {
  WEB_APP: {
    name: 'Web Application',
    description: 'A full-stack web application with modern technologies',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    category: 'web_application',
  },
  API: {
    name: 'REST API',
    description: 'A RESTful API service with comprehensive documentation',
    techStack: ['Node.js', 'Express.js', 'MongoDB', 'Swagger'],
    category: 'api',
  },
  MOBILE_APP: {
    name: 'Mobile Application',
    description: 'Cross-platform mobile app with native performance',
    techStack: ['React Native', 'TypeScript', 'Firebase'],
    category: 'mobile_app',
  },
} as const;

export const AI_PROMPTS = {
  PROFILE_SUMMARY: `
    Generate a professional profile summary based on the following information:
    Skills: {skills}
    Experience: {experience}
    Projects: {projects}
    
    Create a concise, engaging summary that highlights key strengths and career focus.
    Maximum 150 words.
  `,
  SKILL_ANALYSIS: `
    Analyze the following skills and provide insights:
    Skills: {skills}
    Projects: {projects}
    
    Provide:
    1. Skill strengths
    2. Areas for improvement
    3. Market demand analysis
    4. Career path suggestions
  `,
  JOB_MATCH: `
    Analyze the fit between this candidate profile and job requirements:
    
    Candidate Skills: {candidateSkills}
    Job Requirements: {jobRequirements}
    
    Provide:
    1. Fit score (0-100)
    2. Matching skills
    3. Missing skills
    4. Overall assessment
  `,
} as const;

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PROFILE_SLUG: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-z0-9-]+$/,
  },
} as const;

export const FILE_UPLOAD = {
  AVATAR: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
  PROJECT_IMAGE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
  RESUME: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
} as const;

export const RATE_LIMITS = {
  AUTH: {
    LOGIN: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
    REGISTER: { windowMs: 60 * 60 * 1000, max: 3 }, // 3 attempts per hour
  },
  API: {
    GENERAL: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
    AI: { windowMs: 60 * 60 * 1000, max: 10 }, // 10 AI requests per hour
  },
} as const;