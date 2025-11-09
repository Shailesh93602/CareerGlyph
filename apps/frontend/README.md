# Frontend Documentation

## Overview
The frontend is built with Next.js 14 using the App Router, TypeScript, and Tailwind CSS. It provides an interactive dashboard for managing developer profiles and a public profile viewing experience.

## Architecture

### Directory Structure
```
apps/frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                # Utility libraries and configurations
│   ├── hooks/              # Custom React hooks
│   ├── types/              # Frontend-specific types
│   └── utils/              # Helper functions
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

### Key Features
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Authentication**: NextAuth.js integration with GitHub and LinkedIn
- **State Management**: React Query for server state management
- **Real-time Updates**: WebSocket integration for live notifications
- **File Uploads**: Drag-and-drop file upload with AWS S3 integration
- **Code Highlighting**: Syntax highlighting for code snippets
- **Charts & Analytics**: Profile statistics and skill visualizations

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Key Components

### Authentication
- Login/Register forms with validation
- OAuth integration (GitHub, LinkedIn)
- Protected routes and middleware

### Profile Management
- Profile creation and editing
- Skill matrix with verification
- Project showcase with GitHub integration
- Experience and education timeline

### Public Profiles
- Dynamic profile pages with custom URLs
- SEO optimization for public profiles
- Share functionality and analytics

### AI Features
- Profile summary generation
- Skill analysis and recommendations
- Job matching interface

## Development Guidelines

### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  // Define props with proper types
}

export function Component({ prop }: ComponentProps) {
  // Component logic
  return (
    <div className="component-styles">
      {/* JSX content */}
    </div>
  );
}
```

### State Management
- Use React Query for server state
- Use React hooks for local state
- Avoid prop drilling with Context API when needed

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent spacing and colors from design system

### API Integration
```typescript
// Example API hook
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/profile/me'),
  });
}
```