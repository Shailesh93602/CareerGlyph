import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'CareerGlyph - Your Dynamic Developer Profile',
  description: 'Your skills, projects, and impact — not just a PDF.',
  keywords: ['developer', 'portfolio', 'resume', 'career', 'skills', 'projects'],
  authors: [{ name: 'Shailesh Chaudhary' }],
  creator: 'CareerGlyph',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CareerGlyph - Your Dynamic Developer Profile',
    description: 'Your skills, projects, and impact — not just a PDF.',
    siteName: 'CareerGlyph',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerGlyph - Your Dynamic Developer Profile',
    description: 'Your skills, projects, and impact — not just a PDF.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}