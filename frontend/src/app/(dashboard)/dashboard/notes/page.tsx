'use client';

import * as React from 'react';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Write down thoughts, project docs, or brainstorm with AI.
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          Create Note
        </Button>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
        <div className="p-3 rounded-full bg-muted text-muted-foreground mb-4">
          <FileText className="h-8 w-8" />
        </div>
        <CardTitle className="text-lg">No Notes found</CardTitle>
        <CardDescription className="max-w-xs mt-1">
          Create your first note in this workspace to kickstart ZenNote.
        </CardDescription>
        <Button size="sm" variant="outline" className="mt-4">
          Get Started
        </Button>
      </Card>
    </div>
  );
}
