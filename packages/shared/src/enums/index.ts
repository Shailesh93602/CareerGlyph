export enum SkillCategory {
  PROGRAMMING_LANGUAGE = 'programming_language',
  FRAMEWORK = 'framework',
  DATABASE = 'database',
  CLOUD = 'cloud',
  DEVOPS = 'devops',
  MOBILE = 'mobile',
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  DESIGN = 'design',
  PROJECT_MANAGEMENT = 'project_management',
  SOFT_SKILLS = 'soft_skills',
  OTHER = 'other',
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum ProjectCategory {
  WEB_APPLICATION = 'web_application',
  MOBILE_APP = 'mobile_app',
  DESKTOP_APP = 'desktop_app',
  API = 'api',
  LIBRARY = 'library',
  CLI_TOOL = 'cli_tool',
  GAME = 'game',
  DATA_SCIENCE = 'data_science',
  MACHINE_LEARNING = 'machine_learning',
  BLOCKCHAIN = 'blockchain',
  IOT = 'iot',
  OTHER = 'other',
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DEPLOYED = 'deployed',
  MAINTAINED = 'maintained',
  ARCHIVED = 'archived',
}

export enum SocialPlatform {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  STACKOVERFLOW = 'stackoverflow',
  PERSONAL_WEBSITE = 'personal_website',
  BEHANCE = 'behance',
  DRIBBBLE = 'dribbble',
  MEDIUM = 'medium',
  DEV_TO = 'dev_to',
  YOUTUBE = 'youtube',
}

export enum UserRole {
  USER = 'user',
  RECRUITER = 'recruiter',
  ADMIN = 'admin',
}

export enum IntegrationType {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  STACKOVERFLOW = 'stackoverflow',
}

export enum JobMatchStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  INTERESTED = 'interested',
  APPLIED = 'applied',
  INTERVIEWING = 'interviewing',
  REJECTED = 'rejected',
  OFFERED = 'offered',
  ACCEPTED = 'accepted',
}

export enum NotificationType {
  PROFILE_UPDATE = 'profile_update',
  NEW_PROJECT = 'new_project',
  SKILL_VERIFICATION = 'skill_verification',
  JOB_MATCH = 'job_match',
  PROFILE_VIEW = 'profile_view',
  SYSTEM_UPDATE = 'system_update',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  EXPIRED = 'expired',
}