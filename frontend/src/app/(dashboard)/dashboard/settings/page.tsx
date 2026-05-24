'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, User, Sliders } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account profile, workspace details, and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cursor-pointer hover:bg-muted/30 transition-colors">
          <CardHeader>
            <User className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-base">Profile settings</CardTitle>
            <CardDescription>Update your email, name, avatar, and active sessions.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/30 transition-colors">
          <CardHeader>
            <Sliders className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-base">Preferences</CardTitle>
            <CardDescription>Configure notifications, dark mode, and workspace layout.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/30 transition-colors">
          <CardHeader>
            <Shield className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-base">Security & Plan</CardTitle>
            <CardDescription>Manage workspace subscription tiers and API access tokens.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
