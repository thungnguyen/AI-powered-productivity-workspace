import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/client-providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ZenNote — AI-Powered Productivity Workspace',
  description:
    'A premium desktop-first workspace integrating notes, tasks, workspaces, and AI features, inspired by Notion, Linear, and Arc Browser.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
