#!/usr/bin/env bash

# CareerGlyph Development Setup Script

set -e

echo "🚀 Setting up CareerGlyph development environment..."

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
  echo "❌ Node.js 18+ is required. Current version: $(node -v)"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables
if [ ! -f .env ]; then
  echo "📝 Setting up environment variables..."
  cp .env.example .env
  echo "✏️  Please edit .env file with your API keys and configuration"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Generate Prisma client
echo "🔧 Setting up database..."
cd apps/backend
npm run db:generate
npm run db:migrate

# Seed development data (optional)
# npm run db:seed

cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Edit .env file with your API keys"
echo "   2. Run 'npm run dev' to start development servers"
echo "   3. Visit http://localhost:3000 for frontend"
echo "   4. Visit http://localhost:3001/api/docs for API documentation"
echo ""
echo "📚 For more information, check the README.md file"