export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type SkillCategory = 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'TOOL' | 'CLOUD' | 'OTHER';

export interface Endorser {
  username: string;
  name: string;
  avatarUrl: string | null;
  message: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  yearsExp: number | null;
  endorsementCount: number;
  endorsedBy: Endorser[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  isHighlight: boolean;
  startedAt: string | null;
  endedAt: string | null;
}

export interface Profile {
  username: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  websiteUrl: string | null;
  githubLogin: string | null;
  linkedinUrl: string | null;
  memberSince: string;
  skills: Skill[];
  projects: Project[];
}

export interface AuthResponse {
  access_token: string;
  developer: {
    id: string;
    username: string;
    name: string;
    email: string;
  };
}
