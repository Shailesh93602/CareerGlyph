import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Career<span className="text-primary-600">Glyph</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Your skills, projects, and impact — not just a PDF.
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Replace static resumes with dynamic, verifiable, interactive profiles 
            that showcase real skills, projects, and achievements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/auth/signin"
              className="btn-primary px-8 py-4 text-lg"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/demo"
              className="btn-outline px-8 py-4 text-lg"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Enhanced Profiles</h3>
            <p className="text-gray-600">
              Import from GitHub, LinkedIn, and more. AI generates professional summaries and skill matrices.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏗️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Projects</h3>
            <p className="text-gray-600">
              Showcase real code with auto-generated portfolio cards, tech stacks, and live demos.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Recruiter Insights</h3>
            <p className="text-gray-600">
              AI-powered fit analysis helps recruiters quickly assess candidate alignment with roles.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}