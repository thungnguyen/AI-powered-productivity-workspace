'use client';

import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  FileText,
  CheckSquare,
  Sparkles,
  ArrowUpRight,
  Plus,
  Clock,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useLayoutStore } from '@/lib/store/layout-store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DashboardOverviewPage() {
  const { user } = useAuthStore();
  const { activeWorkspace } = useLayoutStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const stats = [
    { label: 'Active Workspace', value: activeWorkspace?.name || 'None', icon: Briefcase, color: 'text-blue-500' },
    { label: 'Total Notes', value: '12', icon: FileText, color: 'text-indigo-500' },
    { label: 'Tasks Pending', value: '4', icon: CheckSquare, color: 'text-amber-500' },
  ];

  const recentNotes = [
    { id: '1', title: 'Product Launch Brainstorm', updated: '2 hours ago', excerpt: 'Ideas for Next.js 15 & Tailwind CSS v4 landing pages...' },
    { id: '2', title: 'Database Migration Strategy', updated: 'Yesterday', excerpt: 'Moving from MySQL local container to production RDS...' },
    { id: '3', title: 'Weekly Sprint Sync', updated: '3 days ago', excerpt: 'Reviewing backlog tasks, assignee workloads, and endpoints...' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.displayName || 'Zen User'}!
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here is what is happening in your <span className="font-semibold text-foreground">{activeWorkspace?.name}</span> today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Ask AI Co-Pilot
            </Button>
            <Button size="sm" className="h-8">
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Entry
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-xl font-bold mt-1.5 truncate max-w-[160px] md:max-w-[200px]">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Dashboard Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Notes */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base font-bold">Recent Notes</CardTitle>
                <CardDescription>Your recently modified draft files</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
                View all
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="group flex flex-col justify-between rounded-lg border border-border p-3 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {note.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {note.updated}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {note.excerpt}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Schedule / Tasks */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base font-bold">Pending Tasks</CardTitle>
                <CardDescription>High priority tasks in this workspace</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
                Open taskboard
                <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <div>
                    <h5 className="text-sm font-semibold">Integrate Auth Token Storage</h5>
                    <span className="text-xs text-muted-foreground">Due: Today</span>
                  </div>
                </div>
                <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded font-semibold uppercase">
                  Urgent
                </span>
              </div>

              <div className="flex items-center justify-between border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div>
                    <h5 className="text-sm font-semibold">Clean Architecture Documentation</h5>
                    <span className="text-xs text-muted-foreground">Due: Tomorrow</span>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-semibold uppercase">
                  High
                </span>
              </div>

              <div className="flex items-center justify-between border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors opacity-70">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                  <div>
                    <h5 className="text-sm font-semibold line-through">Establish Git Rule Checklist</h5>
                    <span className="text-xs text-muted-foreground">Completed</span>
                  </div>
                </div>
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded font-semibold uppercase">
                  Normal
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
