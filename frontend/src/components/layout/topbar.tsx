'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Bell, Search, Sun, Moon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Topbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('dark');
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/40 px-6 backdrop-blur-md">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">ZenNote</span>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const displayLabel = segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={segment}>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className={isLast ? 'font-medium text-foreground' : ''}>
                {displayLabel}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {/* Right controls: Search, Theme Toggle, Notifications */}
      <div className="flex items-center gap-4">
        {/* Mock Command Search */}
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes, tasks... (Cmd+K)"
            className="pl-8 bg-muted/40 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary h-9"
          />
          <kbd className="absolute right-2.5 top-2 h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 flex">
            <span>⌘</span>K
          </kbd>
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications Button */}
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          {/* Notification bubble */}
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
      </div>
    </header>
  );
}
