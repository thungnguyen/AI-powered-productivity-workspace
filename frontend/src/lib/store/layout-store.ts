import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WorkspaceItem {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string | null;
}

interface LayoutState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  workspaces: WorkspaceItem[];
  activeWorkspace: WorkspaceItem | null;
  setActiveWorkspace: (workspace: WorkspaceItem) => void;
  setWorkspaces: (workspaces: WorkspaceItem[]) => void;
}

const DEFAULT_WORKSPACES: WorkspaceItem[] = [
  { id: 'personal', name: 'Personal Workspace', description: 'Your personal sandbox' },
  { id: 'zennote-inc', name: 'ZenNote Inc.', description: 'Collaborative development workspace' },
];

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      workspaces: DEFAULT_WORKSPACES,
      activeWorkspace: DEFAULT_WORKSPACES[0],
      setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
      setWorkspaces: (workspaces) =>
        set((state) => ({
          workspaces,
          activeWorkspace:
            state.activeWorkspace && workspaces.some((w) => w.id === state.activeWorkspace?.id)
              ? state.activeWorkspace
              : workspaces[0] || null,
        })),
    }),
    {
      name: 'zennote-layout-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        activeWorkspace: state.activeWorkspace,
      }),
    }
  )
);
