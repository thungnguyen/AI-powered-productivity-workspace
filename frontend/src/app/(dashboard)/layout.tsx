'use client';

import * as React from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Main Work Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top navigation with search and controls */}
          <Topbar />

          {/* Page contents */}
          <main className="flex-1 overflow-y-auto bg-background/50 dashboard-grid p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
