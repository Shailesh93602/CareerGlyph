'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Globe,
  Github,
  Linkedin,
  Calendar,
  Award,
  Code2,
  ExternalLink,
} from 'lucide-react';
import {
  useProfile,
  useEndorseSkill,
  useRemoveEndorsement,
} from '@/hooks/useProfile';
import { getStoredUser } from '@/lib/auth';
import type { Skill, Project, SkillLevel } from '@/types/profile';

const LEVEL_COLORS: Record<SkillLevel, string> = {
  BEGINNER: 'bg-gray-100 text-gray-600',
  INTERMEDIATE: 'bg-blue-100 text-blue-700',
  ADVANCED: 'bg-purple-100 text-purple-700',
  EXPERT: 'bg-green-100 text-green-700',
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function SkillCard({
  skill,
  profileUsername,
  viewerUsername,
}: {
  skill: Skill;
  profileUsername: string;
  viewerUsername: string | null;
}) {
  const endorse = useEndorseSkill(profileUsername);
  const removeEndorsement = useRemoveEndorsement(profileUsername);
  const [expanded, setExpanded] = useState(false);

  const isOwnProfile = viewerUsername === profileUsername;
  const alreadyEndorsed = viewerUsername
    ? skill.endorsedBy.some(e => e.username === viewerUsername)
    : false;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 truncate">
              {skill.name}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[skill.level]}`}
            >
              {skill.level.charAt(0) + skill.level.slice(1).toLowerCase()}
            </span>
            {skill.yearsExp != null && (
              <span className="text-xs text-gray-400">
                {skill.yearsExp}y exp
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 mt-0.5 block">
            {skill.category}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {skill.endorsementCount > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <Award size={14} />
              {skill.endorsementCount}
            </button>
          )}
          {viewerUsername &&
            !isOwnProfile &&
            (alreadyEndorsed ? (
              <button
                onClick={() => removeEndorsement.mutate(skill.id)}
                disabled={removeEndorsement.isLoading}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={() => endorse.mutate({ skillId: skill.id })}
                disabled={endorse.isLoading}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Endorse
              </button>
            ))}
        </div>
      </div>

      {expanded && skill.endorsedBy.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {skill.endorsedBy.map(endorser => (
            <div key={endorser.username} className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs font-medium text-blue-700">
                {endorser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-gray-700">
                  @{endorser.username}
                </span>
                {endorser.message && (
                  <p className="text-xs text-gray-500 mt-0.5 italic">
                    "{endorser.message}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className={`bg-white border rounded-lg p-5 hover:shadow-md transition-shadow ${project.isHighlight ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-200'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{project.title}</h3>
            {project.isHighlight && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {project.description}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="GitHub repository"
            >
              <Github size={18} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Live demo"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.techStack.map(tech => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {(project.startedAt || project.endedAt) && (
        <p className="text-xs text-gray-400 mt-2">
          {formatDate(project.startedAt)}
          {project.endedAt ? ` – ${formatDate(project.endedAt)}` : ' – Present'}
        </p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const { data: profile, isLoading, isError } = useProfile(username);
  const [viewerUsername, setViewerUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    setViewerUsername(user?.username ?? null);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">
          Loading profile…
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700">
            @{username} not found
          </p>
          <p className="text-gray-500 mt-2">
            This profile doesn't exist or is private.
          </p>
        </div>
      </div>
    );
  }

  const categorized = profile.skills.reduce<Record<string, Skill[]>>(
    (acc, s) => {
      (acc[s.category] ??= []).push(s);
      return acc;
    },
    {}
  );

  const highlightProjects = profile.projects.filter(p => p.isHighlight);
  const otherProjects = profile.projects.filter(p => !p.isHighlight);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-blue-600">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-blue-600 font-medium">@{profile.username}</p>
              {profile.bio && (
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {profile.location}
                  </span>
                )}
                {profile.websiteUrl && (
                  <a
                    href={profile.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <Globe size={14} />
                    {profile.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                )}
                {profile.githubLogin && (
                  <a
                    href={`https://github.com/${profile.githubLogin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  >
                    <Github size={14} />
                    {profile.githubLogin}
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={14} />
                    LinkedIn
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Member since {formatDate(profile.memberSince)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.skills.length}
              </p>
              <p className="text-xs text-gray-500">Skills</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.projects.length}
              </p>
              <p className="text-xs text-gray-500">Projects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.skills.reduce((sum, s) => sum + s.endorsementCount, 0)}
              </p>
              <p className="text-xs text-gray-500">Endorsements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* Skills */}
        {profile.skills.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Award size={20} className="text-blue-600" />
              Skills
            </h2>
            <div className="space-y-6">
              {Object.entries(categorized).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skills.map(skill => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        profileUsername={username}
                        viewerUsername={viewerUsername}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {highlightProjects.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Code2 size={20} className="text-blue-600" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {highlightProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <Code2 size={20} className="text-gray-500" />
              Other Projects
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {otherProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {profile.skills.length === 0 && profile.projects.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">
              @{profile.username} hasn't added anything yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
