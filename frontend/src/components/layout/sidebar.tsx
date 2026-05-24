'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Settings,
  LogOut,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  User,
  Sparkles
} from 'lucide-react';
import { useLayoutStore, WorkspaceItem } from '@/lib/store/layout-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarCollapsed,
    toggleSidebar,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
  } = useLayoutStore();
  const { user, logout } = useAuthStore();
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Notes', href: '/dashboard/notes', icon: FileText },
    { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleWorkspaceChange = (workspace: WorkspaceItem) => {
    setActiveWorkspace(workspace);
    setShowWorkspaceDropdown(false);
  };

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex h-screen flex-col border-r border-border bg-card/60 backdrop-blur-md transition-colors"
    >
      {/* Sidebar Header: Workspace Switcher */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="relative w-full"
            >
              <button
                onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                className="flex w-full items-center justify-between rounded-md p-1.5 hover:bg-accent text-left"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
                    {activeWorkspace?.name.charAt(0)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-semibold leading-tight">
                      {activeWorkspace?.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground leading-none">
                      Pro Plan
                    </span>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>

              {/* Workspaces Dropdown */}
              {showWorkspaceDropdown && (
                <div className="absolute left-0 top-12 z-50 w-full rounded-md border border-border bg-popover p-1 shadow-lg">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Workspaces
                  </div>
                  {workspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => handleWorkspaceChange(w)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-left hover:bg-accent',
                        w.id === activeWorkspace?.id && 'bg-accent/50 font-medium'
                      )}
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/20 text-primary font-bold text-xs">
                        {w.name.charAt(0)}
                      </div>
                      <span className="truncate">{w.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-left text-muted-foreground hover:bg-accent">
                      <Plus className="h-3 w-3" />
                      Create Workspace
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex w-full justify-center">
              <button
                onClick={toggleSidebar}
                className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm"
              >
                {activeWorkspace?.name.charAt(0)}
              </button>
            </div>
          )}
        </AnimatePresence>

        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sidebar Body: Navigation Links */}
      <div className="flex-1 space-y-1 py-4 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 cursor-pointer relative group',
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.name}
                  </motion.span>
                )}
                {/* Visual indicator bar on hover or active */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-md bg-foreground" />
                )}
              </span>
            </Link>
          );
        })}
      </div>

      {/* AI Glow Badge */}
      {!sidebarCollapsed && (
        <div className="m-3 p-3 rounded-lg border border-primary/20 bg-primary/5 dark:bg-primary/2 shadow-inner relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-primary/10 blur-xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
            <Sparkles className="h-3 w-3 animate-pulse" />
            AI Co-Pilot Active
          </div>
          <p className="text-[10px] text-muted-foreground leading-normal">
            Select text or press <kbd className="bg-muted px-1 rounded">Cmd + K</kbd> to trigger AI assistant.
          </p>
        </div>
      )}

      {/* Sidebar Footer: User details and collapse switch */}
      <div className="border-t border-border p-3">
        {sidebarCollapsed ? (
          <div className="flex flex-col gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="truncate text-xs font-medium leading-none">
                  {user?.displayName || 'User'}
                </span>
                <span className="truncate text-[10px] text-muted-foreground mt-0.5">
                  {user?.email || 'user@zennote.com'}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
