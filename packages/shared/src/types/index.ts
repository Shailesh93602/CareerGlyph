// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  slug: string;
  title: string;
  summary: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  isPublic: boolean;
  profileHealth: number;
  aiInsights?: AIInsights;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsOfExperience: number;
  verified: boolean;
  verificationSource?: string;
  endorsements: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  location?: string;
  skills: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  category: ProjectCategory;
  featured: boolean;
  stars?: number;
  forks?: number;
  language?: string;
  status: ProjectStatus;
  codeSnippet?: CodeSnippet;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeSnippet {
  language: string;
  code: string;
  explanation: string;
  lineCount: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  verified: boolean;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  username: string;
  verified: boolean;
}

export interface AIInsights {
  strengthsAnalysis: string[];
  skillGaps: string[];
  careerSuggestions: string[];
  profileOptimization: string[];
  marketDemand: SkillDemand[];
  lastAnalyzed: Date;
}

export interface SkillDemand {
  skill: string;
  demandLevel: 'low' | 'medium' | 'high' | 'very-high';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  jobOpenings: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Integration Types
export interface GitHubIntegration {
  username: string;
  accessToken: string;
  repositories: GitHubRepository[];
  lastSync: Date;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  private: boolean;
  url: string;
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkedInIntegration {
  profileId: string;
  accessToken: string;
  profile: LinkedInProfile;
  lastSync: Date;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  location: string;
  industry: string;
  photoUrl?: string;
  positions: LinkedInPosition[];
  educations: LinkedInEducation[];
}

export interface LinkedInPosition {
  id: string;
  title: string;
  company: string;
  startDate: {
    month: number;
    year: number;
  };
  endDate?: {
    month: number;
    year: number;
  };
  isCurrent: boolean;
  description?: string;
}

export interface LinkedInEducation {
  id: string;
  schoolName: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: {
    year: number;
  };
  endDate?: {
    year: number;
  };
}

// Job and Recruiter Types
export interface JobMatch {
  id: string;
  profileId: string;
  jobDescription: string;
  requirements: string[];
  fitScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  aiAnalysis: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location?: string;
  company?: string;
  createdAt: Date;
}

export interface RecruiterInsights {
  candidateId: string;
  strengths: string[];
  weaknesses: string[];
  fitForRole: number;
  communicationStyle: string;
  workStyle: string;
  recommendedInterviewQuestions: string[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
}